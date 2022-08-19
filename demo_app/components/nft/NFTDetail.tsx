import {
  Button,
  Center,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Portal,
  SkeletonCircle,
  SkeletonText,
  Spacer,
  Text,
  VStack,
  useDisclosure,
  useStyleConfig,
} from "@chakra-ui/react";
import { getLogo, supportedChainIds } from "../../constants/chains";
import {
  getShortSpanningAddress,
  getSpanningAddress,
  parseSpanningAddress,
  toAbi,
} from "@spanning/utils";
import {
  isNftSettlementChain,
  nftAddress,
  nftMaxImages,
} from "../../constants/nftContract";
import { useEffect, useState } from "react";

import { ActionButton } from "../form/ActionButton";
import { AddressExplainer } from "../form/AddressExplainer";
import { AmountInput } from "../form/AmountInput";
import { NetworkSelector } from "../form/NetworkSelector";
import { OwnedBadge } from "../ImageWithBadge";
import { RequestState } from "../../utils/requestState";
import { TxnProcess } from "../form/TxnProcess";
import { ethers } from "ethers";
import { useContractBalance } from "../ContractBalanceContext";
import { useMakeRequest } from "../../hooks/useMakeRequest";
import { useSpanningWeb3Provider } from "../SpanningWeb3Context";

export function NFTDetail({
  nftId,
  currentOwnerPromise,
  showOwnedOnly,
}: {
  nftId: number;
  currentOwnerPromise: Promise<any>;
  showOwnedOnly: boolean;
}) {
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
  const { nftBalance } = useContractBalance();

  // IO Data
  const [inputNetwork, setInputNetwork] = useState(supportedChainIds[0]);
  const [inputAddress, setInputAddress] = useState("");
  const [buttonText, setButtonText] = useState("Transfer Ownership");
  const [currentOwner, setCurrentOwner] = useState<string | undefined>();

  // IO Update functions
  const inputNetworkChanged = (input: string) => setInputNetwork(input);
  const inputAddressChanged = (e: any) => setInputAddress(e.target.value);
  useEffect(() => {
    currentOwnerPromise.then((owner) => {
      setCurrentOwner(owner);
    });
  }, [currentOwnerPromise]);

  // IO Errors
  const [isInputAddressValid, setInputAddressValid] = useState(true);
  useEffect(() => {
    setInputAddressValid(
      ethers.utils.isAddress(inputAddress ?? "0xERROR") &&
        (userSpanningAddress ?? "").toLowerCase() !==
          getSpanningAddress(parseInt(inputNetwork), inputAddress).toLowerCase()
    );
  }, [inputAddress, inputNetwork, userSpanningAddress]);

  // Function to execute a transfer transaction
  const doNFTTransfer = async () => {
    // Bail out early if we are not allowed to perform actions
    if (!actionsEnabled || userSpanningAddress === undefined) {
      return;
    }
    // Get data for the transaction
    const payload = toAbi(
      "transferFrom",
      ["bytes32", "bytes32", "uint256"],
      [
        userSpanningAddress,
        getSpanningAddress(parseInt(inputNetwork), inputAddress),
        nftId.toString(),
      ]
    );

    // Execute the transaction
    makeRequest(nftAddress, payload);
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

  // Ways to detect remote settlement: balance update or same chain event:
  // Only triggers on nftBalance changes
  useEffect(() => {
    // Request state update when the transaction settles remotely
    if (
      waitingOn === RequestState.kDestinationSettlement ||
      waitingOn === RequestState.kSourceConfirmation
    ) {
      setWaitingOn(RequestState.kCompleted);
    }
  }, [nftBalance]);

  const determineSettlement = (currChainId: number) => {
    if (isNftSettlementChain(currChainId.toString())) {
      return RequestState.kCompleted;
    } else {
      return RequestState.kDestinationSettlement;
    }
  };

  const resetStates = () => {
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
        logEvent("nft_transfer_metamask_success");
        setWaitingOn(determineSettlement(chainId ?? 0));
        break;
      case "Fail":
      case "Exception":
        logEvent("nft_transfer_metamask_failure");
        resetStates();
        break;
    }
  }, [txnStatus]);

  const userOwnsNFT =
    actionsEnabled &&
    currentOwner !== undefined &&
    userSpanningAddress !== undefined &&
    userSpanningAddress.toLowerCase() === currentOwner.toLowerCase();

  const { chainId: ownerChainId, localAddress: ownerLocalAddress } =
    parseSpanningAddress(currentOwner ?? "");

  const stylesGallery = useStyleConfig("Card", { variant: "nft" });
  const stylesDetail = useStyleConfig("Card", { variant: "nftDetail" });
  const showCard = showOwnedOnly ? userOwnsNFT : !userOwnsNFT;

  const cardUI = (style: any, size: string) => (
    <VStack
      __css={style}
      spacing="1rem"
      align="left"
      justifyContent="space-around"
      onClick={onOpen}
    >
      {/* NFT Image */}
      <Center>
        <SkeletonCircle
          w={size}
          h={size}
          isLoaded={ownerLocalAddress.length > 0}
        >
          <Image
            src={`images/nft/${nftId % nftMaxImages}.png`}
            alt={`NFT #${nftId}`}
            pb="1rem"
          />
        </SkeletonCircle>
      </Center>

      {/* NFT Owner */}
      <HStack>
        <Text
          variant="subtitle"
          fontWeight="bold"
        >{`NFT #${nftId.toString()}`}</Text>
        {userOwnsNFT && <OwnedBadge text="Your NFT" showBadge={true} />}
      </HStack>
      <SkeletonText
        isLoaded={!isNaN(ownerChainId) && ownerLocalAddress.length > 0}
        noOfLines={1}
        spacing="4"
      >
        <HStack justify="left" spacing="3px">
          <Text fontSize="sm" fontWeight="bold">
            Owner:
          </Text>
          <Image src={getLogo(ownerChainId.toString())} h="20px" w="20px" />
          <Text fontSize="sm">
            {!isNaN(ownerChainId) &&
              getShortSpanningAddress(ownerChainId, ownerLocalAddress)}
          </Text>
        </HStack>
      </SkeletonText>
    </VStack>
  );
  const inTxn = waitingOn !== RequestState.kInputs;
  const sourceProcessed =
    waitingOn === RequestState.kDestinationSettlement ||
    waitingOn === RequestState.kCompleted;

  // Render the UI!
  return (
    <>
      {/* Regular grid card */}
      {showCard && cardUI(stylesGallery, "250px")}
      <Portal>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            if (waitingOn === RequestState.kCompleted) {
              resetStates();
            }
            onClose();
          }}
          size="5xl"
          isCentered
        >
          <ModalOverlay backdropFilter="blur(10px)" />
          <ModalContent>
            <ModalCloseButton as={Button} size="sm" />
            <ModalBody p="2em" bg="brand.white">
              <HStack spacing="1rem" h="100%" align="start">
                {/* Detail card view */}
                {cardUI(stylesDetail, "350px")}

                {/* Show not owned content */}
                {!userOwnsNFT && !inTxn && (
                  <VStack
                    align="center"
                    p="1em"
                    bg="brand.primaryFaded"
                    borderRadius="lg"
                    w="100%"
                  >
                    <Image src="images/friends.svg" alt="friends" w="10rem" />
                    <Text>
                      If this was your NFT, this is where you would be able to
                      transfer it to another wallet.
                    </Text>
                    <Spacer />
                    <Text fontWeight="bold">For example...</Text>
                    <Text>
                      Maybe you want to transfer ownership to your friend on
                      Avalanche.
                    </Text>
                    <Text>...or your friend on Ethereum!</Text>
                  </VStack>
                )}

                {/* Show transfer input */}
                {userOwnsNFT && !inTxn && (
                  <VStack
                    align="center"
                    p="1em"
                    bg="brand.lightGray"
                    borderRadius="lg"
                    h="100%"
                    w="100%"
                  >
                    {/* Header text */}
                    <Text variant="subtitle" pt="1rem">
                      Choose an address and a network to send the NFT to
                    </Text>

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
                        inputAddress.length > 0 &&
                        actionsEnabled &&
                        !isInputAddressValid
                      }
                      showHelperText={
                        inputAddress.length > 0 &&
                        actionsEnabled &&
                        !isInputAddressValid
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
                      showRightButton={
                        account !== undefined && account !== null
                      }
                      rightButtonText="ME"
                      rightButtonWidth="10%"
                      onRightButtonClick={() => {
                        setInputAddress(account!);
                      }}
                    />

                    {/* Spanning Address Explainer */}
                    <AddressExplainer
                      inputNetwork={inputNetwork}
                      inputAddress={inputAddress!}
                    />

                    {/* Submit button */}
                    <ActionButton
                      disableTooltip={actionsEnabled}
                      tooltipText="Log in with Metamask to enable"
                      disableButton={
                        !actionsEnabled ||
                        !isInputAddressValid ||
                        waitingOn !== RequestState.kInputs
                      }
                      buttonText={buttonText}
                      onButtonClick={() => {
                        logEvent("nft_transfer_click", {
                          userSpanningAddress,
                          inputAddress,
                          inputNetwork,
                          nftId,
                        });
                        doNFTTransfer();
                      }}
                    />
                  </VStack>
                )}

                {/* Show transfer processing */}
                {inTxn && (
                  <VStack align="center" p="1em" pt="4rem" h="100%" w="100%">
                    <TxnProcess
                      status={waitingOn}
                      settled={waitingOn === RequestState.kCompleted}
                      showSettlement={sourceProcessed}
                      showSuccess={sourceProcessed}
                      showCrosschain={
                        sourceProcessed &&
                        actionsEnabled &&
                        chainId !== parseInt(inputNetwork)
                      }
                      showDetails={sourceProcessed}
                      headline={`Transferring NFT #${nftId}`}
                      transferFrom={userShortSpanningAddress ?? "0xERROR"}
                      transferTo={getShortSpanningAddress(
                        parseInt(inputNetwork),
                        inputAddress
                      )}
                    />
                  </VStack>
                )}
              </HStack>
            </ModalBody>
            <ModalFooter bg="brand.white" pt="0px">
              {/* Close button */}
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Portal>
    </>
  );
}
