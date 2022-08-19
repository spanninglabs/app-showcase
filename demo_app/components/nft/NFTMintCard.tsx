import {
  HStack,
  Skeleton,
  SkeletonText,
  Text,
  VStack,
  useStyleConfig,
} from "@chakra-ui/react";
import { isNftSettlementChain, nftAddress } from "../../constants/nftContract";
import { useEffect, useState } from "react";

import { ActionButton } from "../form/ActionButton";
import { RequestState } from "../../utils/requestState";
import { StatusSpinner } from "../form/TxnProcess";
import { toAbi } from "@spanning/utils";
import { useContractBalance } from "../ContractBalanceContext";
import { useMakeRequest } from "../../hooks/useMakeRequest";
import { useNFTOwners } from "./NFTOwnerContext";
import { useSpanningWeb3Provider } from "../SpanningWeb3Context";

export function NFTMintCard() {
  const { actionsEnabled, userSpanningAddress, logEvent, chainId } =
    useSpanningWeb3Provider();
  const { nftBalance } = useContractBalance();
  const { currentSupply, totalSupply } = useNFTOwners();
  const { makeRequest, txnStatus } = useMakeRequest();

  // IO Data
  const [buttonText, setButtonText] = useState("Mint");

  // Function to execute a mint transaction
  const doNFTMint = async () => {
    // Bail out early if we are not allowed to perform actions
    if (!actionsEnabled || userSpanningAddress === undefined) {
      return;
    }
    // Get data for the transaction
    const payload = toAbi("mint", ["bytes32"], [userSpanningAddress]);

    // Execute the transaction
    makeRequest(nftAddress, payload);
  };

  // State Machine for the transaction process
  const [waitingOn, setWaitingOn] = useState(RequestState.kInputs);

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
        logEvent("nft_mint_metamask_success");
        setWaitingOn(determineSettlement(chainId ?? 0));
        break;
      case "Fail":
      case "Exception":
        logEvent("nft_mint_metamask_failure");
        resetStates();
        break;
    }
  }, [txnStatus]);

  const inTxn =
    waitingOn !== RequestState.kInputs && waitingOn !== RequestState.kCompleted;

  const stylesMint = useStyleConfig("Card", { variant: "mint" });
  const stylesDetail = useStyleConfig("Card", { variant: "nft" });

  // Render the UI!
  return (
    <>
      {/* Normal mint card */}
      <VStack
        __css={stylesMint}
        spacing="1.5em"
        align="center"
        justifyContent="space-between"
      >
        {/* Header text */}
        <Text variant="midtitle">Mint NFT</Text>
        <Text align="center">
          Mint your very own Spanning NFT to a wallet on any supported test
          chain!
        </Text>
        <HStack spacing="2px">
          {/* NFT supply */}
          <SkeletonText
            isLoaded={currentSupply !== undefined}
            w="35px"
            noOfLines={1}
          >
            <Text align="center" fontWeight="bold">
              {currentSupply}
            </Text>
          </SkeletonText>
          <Text>/</Text>
          <SkeletonText isLoaded={totalSupply > 0} w="50px" noOfLines={1}>
            <Text align="center" fontWeight="bold">
              {totalSupply}
            </Text>
          </SkeletonText>
          <Text>Minted</Text>
        </HStack>

        {/* Mint button */}
        <ActionButton
          disableTooltip={actionsEnabled}
          tooltipText="Log in with Metamask to enable"
          disableButton={
            !actionsEnabled || inTxn || currentSupply === undefined
          }
          buttonText={buttonText}
          onButtonClick={() => {
            logEvent("token_mint_click");
            doNFTMint();
          }}
        />
      </VStack>

      {/* Mint in progress card */}
      {inTxn && (
        <VStack
          __css={stylesDetail}
          spacing="1em"
          pb="0.5rem"
          align="center"
          justifyContent="space-around"
        >
          <Skeleton w="248px" h="248px" isLoaded={false} />
          <Text w="100%" mb="-5px" variant="subtitle">
            <b>{`Minting NFT #${currentSupply}`}</b>
          </Text>
          <StatusSpinner complete={false} status={waitingOn} size="xs" />
        </VStack>
      )}
    </>
  );
}
