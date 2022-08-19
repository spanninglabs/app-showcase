import {
  Button,
  Center,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  isTokenSettlementChain,
  maxMintPerTxn,
  tokenAddress,
  tokenName,
} from "../../constants/tokenContract";
import { useEffect, useState } from "react";

import { ActionButton } from "../form/ActionButton";
import { AmountInput } from "../form/AmountInput";
import { RequestState } from "../../utils/requestState";
import { TokenBalance } from "./TokenBalance";
import { TxnProcess } from "../form/TxnProcess";
import { toAbi } from "@spanning/utils";
import { useContractBalance } from "../ContractBalanceContext";
import { useMakeRequest } from "../../hooks/useMakeRequest";
import { useSpanningWeb3Provider } from "../SpanningWeb3Context";

export function TokenMintPage() {
  // Web3 React hooks
  const {
    userSpanningAddress,
    userShortSpanningAddress,
    actionsEnabled,
    chainId,
    logEvent,
  } = useSpanningWeb3Provider();
  const { makeRequest, txnStatus } = useMakeRequest();
  const { tokenBalance } = useContractBalance();

  // IO Data
  const [inputAmount, setInputAmount] = useState(10);
  const [buttonText, setButtonText] = useState("Mint");

  // IO Update functions
  const inputAmountChanged = (e: any) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      setInputAmount(e.target.value);
    }
  };

  // IO Errors
  const [isInputAmountValid, setInputAmountValid] = useState(true);
  useEffect(() => {
    setInputAmountValid(inputAmount > 0 && inputAmount <= maxMintPerTxn);
  }, [inputAmount]);

  // Function to execute a mint transaction
  const doTokenMint = () => {
    // Bail out early if we are not allowed to perform actions
    if (!actionsEnabled || userSpanningAddress === undefined) {
      return;
    }
    // Get data for the transaction
    const payload = toAbi(
      "mint",
      ["bytes32", "uint256"],
      [userSpanningAddress, inputAmount.toString()]
    );

    // Execute the transaction
    makeRequest(tokenAddress, payload);
  };

  // State Machine for the transaction process
  const [waitingOn, setWaitingOn] = useState(RequestState.kInputs);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Only triggers on state changes
  useEffect(() => {
    // Change text based on current state
    switch (waitingOn) {
      case RequestState.kInputs:
      case RequestState.kCompleted:
        setButtonText("Mint");
        break;
      case RequestState.kSourceAuth:
        setButtonText("See Wallet");
        break;
      case RequestState.kSourceConfirmation:
        setButtonText("Minting...");
        break;
      case RequestState.kDestinationSettlement:
        setButtonText("Settling...");
        break;
    }
  }, [waitingOn]);

  // Ways to detect remote settlement: balance update or same chain event
  // Only triggers on tokenBalance changes
  useEffect(() => {
    // Request state update when the transaction settles remotely
    if (waitingOn === RequestState.kDestinationSettlement) {
      setWaitingOn(RequestState.kCompleted);
    }
  }, [tokenBalance]);

  const determineSettlement = (currChainId: number) => {
    if (isTokenSettlementChain(currChainId.toString())) {
      return RequestState.kCompleted;
    } else {
      return RequestState.kDestinationSettlement;
    }
  };

  const resetStates = () => {
    onClose();
    setWaitingOn(RequestState.kInputs);
  };

  // Only trigger on txnStatus
  useEffect(() => {
    // Advance state based on txn status
    switch (txnStatus) {
      case "None":
        setWaitingOn(RequestState.kInputs);
        break;
      case "PendingSignature":
        setWaitingOn(RequestState.kSourceAuth);
        break;
      case "Mining":
        setWaitingOn(RequestState.kSourceConfirmation);
        break;
      case "Success":
        // Since the source chain has processed the transaction, the
        // Spanning Network relays the request to the destination chain.
        logEvent("token_mint_metamask_success");
        setWaitingOn(determineSettlement(chainId ?? 0));
        break;
      case "Fail":
      case "Exception":
        logEvent("token_mint_metamask_failure");
        resetStates();
        break;
    }
  }, [txnStatus]);

  // Extra UI check to keep the details open until the modal is closed
  useEffect(() => {
    if (waitingOn === RequestState.kCompleted && !isOpen) {
      setWaitingOn(RequestState.kInputs);
    }
  });

  const sourceProcessed =
    waitingOn === RequestState.kCompleted ||
    waitingOn === RequestState.kDestinationSettlement;

  // Render the UI
  return (
    <>
      {/* Header text */}
      <Text color="brand.fadedText">
        {`Mint ${tokenName}, a natively multichain token. The token has the same
        utility and value across all supported chains, it's never wrapped!`}
      </Text>

      {/* Input for amount to mint */}
      <AmountInput
        disabled={waitingOn !== RequestState.kInputs}
        isInvalid={actionsEnabled && !isInputAmountValid}
        showHelperText={actionsEnabled && !isInputAmountValid}
        helperText={`Must be under ${maxMintPerTxn}`}
        inputType="number"
        value={inputAmount}
        onValueChange={inputAmountChanged}
        showRightButton={true}
        rightButtonText="MAX AMOUNT"
        rightButtonWidth="25%"
        onRightButtonClick={() => {
          setInputAmount(maxMintPerTxn);
        }}
      />

      <HStack justify="end">
        {/* Submit button */}
        <ActionButton
          disableTooltip={actionsEnabled}
          tooltipText="Log in with Metamask to enable"
          disableButton={
            !actionsEnabled ||
            !isInputAmountValid ||
            waitingOn !== RequestState.kInputs
          }
          buttonText={buttonText}
          onButtonClick={() => {
            logEvent("token_mint_click", {
              userSpanningAddress,
              inputAmount,
            });
            onOpen();
            doTokenMint();
          }}
        />

        {/* View Modal */}
        {waitingOn !== RequestState.kInputs && (
          <ActionButton
            disableTooltip={true}
            disableButton={false}
            buttonText="View Status"
            onButtonClick={() => {
              onOpen();
            }}
          />
        )}
      </HStack>

      {/* Token balance */}
      <Center>
        <TokenBalance />
      </Center>

      {/* Transaction progress modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent w="60%">
          <ModalCloseButton as={Button} size="sm" />
          <ModalBody p="2em" bg="brand.white">
            <Spacer h="3rem" />
            <TxnProcess
              status={waitingOn}
              settled={waitingOn === RequestState.kCompleted}
              showSettlement={sourceProcessed}
              showSuccess={sourceProcessed}
              showCrosschain={
                sourceProcessed &&
                actionsEnabled &&
                !isTokenSettlementChain((chainId ?? 0).toString())
              }
              showDetails={sourceProcessed}
              headline={`Minting ${inputAmount} ${tokenName}`}
              transferTo={userShortSpanningAddress ?? "0xERROR"}
            />
          </ModalBody>

          <ModalFooter bg="brand.white" pt="0px">
            {/* Close button */}
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
