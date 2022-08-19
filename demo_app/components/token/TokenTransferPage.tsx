import {
  Button,
  Center,
  Circle,
  HStack,
  Icon,
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
  getShortSpanningAddress,
  getSpanningAddress,
  toAbi,
} from "@spanning/utils";
import {
  isTokenSettlementChain,
  tokenAddress,
  tokenName,
} from "../../constants/tokenContract";
import { useEffect, useState } from "react";

import { ActionButton } from "../form/ActionButton";
import { AddressExplainer } from "../form/AddressExplainer";
import { AmountInput } from "../form/AmountInput";
import { HiOutlineArrowDown } from "react-icons/hi";
import { NetworkSelector } from "../form/NetworkSelector";
import { RequestState } from "../../utils/requestState";
import { TokenBalance } from "./TokenBalance";
import { TxnProcess } from "../form/TxnProcess";
import { ethers } from "ethers";
import { supportedChainIds } from "../../constants/chains";
import { useContractBalance } from "../ContractBalanceContext";
import { useMakeRequest } from "../../hooks/useMakeRequest";
import { useSpanningWeb3Provider } from "../SpanningWeb3Context";

export function TokenTransferPage() {
  // Web3 React hooks
  const {
    account,
    userSpanningAddress,
    actionsEnabled,
    chainId,
    userShortSpanningAddress,
    logEvent,
  } = useSpanningWeb3Provider();
  const { makeRequest, txnStatus } = useMakeRequest();
  const { tokenBalance } = useContractBalance();

  // IO Data
  const [inputAmount, setInputAmount] = useState(10);
  const [inputNetwork, setInputNetwork] = useState(supportedChainIds[0]);
  const [inputAddress, setInputAddress] = useState("");
  const [buttonText, setButtonText] = useState("Transfer Ownership");

  // IO Update functions
  const inputAmountChanged = (e: any) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      setInputAmount(e.target.value);
    }
  };
  const inputNetworkChanged = (input: string) => setInputNetwork(input);
  const inputAddressChanged = (e: any) => setInputAddress(e.target.value);

  // IO Errors
  const [isInputAmountValid, setInputAmountValid] = useState(true);
  const [isInputAddressValid, setInputAddressValid] = useState(true);

  useEffect(() => {
    setInputAmountValid(
      inputAmount > 0 &&
        tokenBalance !== undefined &&
        tokenBalance - inputAmount >= 0
    );
  }, [tokenBalance, inputAmount]);

  useEffect(() => {
    setInputAddressValid(
      ethers.utils.isAddress(inputAddress ?? "0xERROR") &&
        (userSpanningAddress ?? "").toLowerCase() !==
          getSpanningAddress(parseInt(inputNetwork), inputAddress).toLowerCase()
    );
  }, [inputAddress, inputNetwork, userSpanningAddress]);

  // Function to execute a transfer transaction
  const doTokenTransfer = async () => {
    // Bail out early if we are not allowed to perform actions
    if (!actionsEnabled) {
      return;
    }
    // Get data for the transaction
    const payload = toAbi(
      "transfer",
      ["bytes32", "uint256"],
      [
        getSpanningAddress(parseInt(inputNetwork), inputAddress),
        inputAmount.toString(),
      ]
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
        setButtonText("Transfer Ownership");
        break;
      case RequestState.kSourceAuth:
        setButtonText("See Wallet");
        break;
      case RequestState.kSourceConfirmation:
        setButtonText("Transferring...");
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
        logEvent("token_transfer_metamask_success");
        setWaitingOn(determineSettlement(chainId ?? 0));
        break;
      case "Fail":
      case "Exception":
        logEvent("token_transfer_metamask_failure");
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

  // Render the UI!
  return (
    <>
      {/* Header text */}
      <Text color="brand.fadedText">
        {`Transfer ${tokenName}. You can transfer ${tokenName} to any other
          supported test chain and it's never wrapped.
          ${tokenName} = ${tokenName}.
          Send some to your other test wallets or a friend.`}
      </Text>

      {/* Input for amount to transfer */}
      <AmountInput
        disabled={waitingOn !== RequestState.kInputs}
        isInvalid={actionsEnabled && !isInputAmountValid}
        showHelperText={actionsEnabled && !isInputAmountValid}
        helperText="Exceeds current balance"
        inputType="number"
        value={inputAmount}
        onValueChange={inputAmountChanged}
        showRightButton={false}
      />

      {/* Down arrow */}
      <Center>
        <Circle
          size="50px"
          bg="brand.primaryFaded"
          m="-2.5rem 0rem"
          zIndex="990"
          position="sticky"
        >
          <Icon
            as={HiOutlineArrowDown}
            color="brand.primary"
            w="25px"
            h="25px"
          />
        </Circle>
      </Center>

      {/* Input for network */}
      <NetworkSelector
        onNetworkChange={(newNetwork: string) => {
          inputNetworkChanged(newNetwork);
        }}
      />

      {/* Input for destination address */}
      <AmountInput
        disabled={waitingOn !== RequestState.kInputs}
        isInvalid={
          inputAddress.length > 0 && actionsEnabled && !isInputAddressValid
        }
        showHelperText={
          inputAddress.length > 0 && actionsEnabled && !isInputAddressValid
        }
        helperText={
          ethers.utils.isAddress(inputAddress ?? "0xERROR")
            ? "Cannot transfer to yourself"
            : "Must be a valid chain address"
        }
        placeholderText="0x..."
        inputType="text"
        value={inputAddress}
        onValueChange={inputAddressChanged}
        showRightButton={account !== undefined && account !== null}
        rightButtonText="ME"
        rightButtonWidth="10%"
        onRightButtonClick={() => {
          setInputAddress(account ?? "0xERROR");
        }}
      />

      <Spacer />

      {/* Spanning Address Explainer */}
      <AddressExplainer
        inputNetwork={inputNetwork}
        inputAddress={inputAddress ?? "0xERROR"}
      />

      <HStack justify="end">
        {/* Submit button */}
        <ActionButton
          disableTooltip={actionsEnabled}
          tooltipText="Log in with Metamask to enable"
          disableButton={
            !actionsEnabled ||
            !isInputAddressValid ||
            !isInputAmountValid ||
            waitingOn !== RequestState.kInputs
          }
          buttonText={buttonText}
          onButtonClick={() => {
            logEvent("token_transfer_click", {
              userSpanningAddress,
              inputAmount,
              inputAddress,
              inputNetwork,
            });
            onOpen();
            doTokenTransfer();
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
              headline={`Transferring ${inputAmount} ${tokenName}`}
              transferFrom={userShortSpanningAddress ?? "0xERROR"}
              transferTo={getShortSpanningAddress(
                parseInt(inputNetwork),
                inputAddress
              )}
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
