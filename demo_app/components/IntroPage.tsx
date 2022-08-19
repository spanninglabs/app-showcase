import { HStack, Image, Text, VStack } from "@chakra-ui/react";

import { ActionButton } from "./form/ActionButton";
import { PageState } from "../utils/pageState";
import { numChains } from "../constants/chains";
import { useSpanningWeb3Provider } from "./SpanningWeb3Context";

interface IntroPageProps {
  setPage: (page: PageState) => void;
}

export function IntroPage(props: IntroPageProps) {
  const { actionsEnabled, logEvent } = useSpanningWeb3Provider();
  const isDisabled = !actionsEnabled;

  // Render the UI!
  return (
    <HStack w="100%" p="1rem">
      <VStack w="55%" align="start" spacing="1rem">
        {/* Logo */}
        <Image
          src="images/logo_black.png"
          alt="Spanning Labs Logo"
          w="25rem"
          ml="-15px"
        />

        {/* Intro text */}
        <Text variant="title">Welcome to our Demo App!</Text>
        <Text variant="subtitle">
          Here you can view some examples of Spanning Network in action by
          minting and transferring ownership of multichain tokens and NFTs
          across {numChains} test networks.
        </Text>
        <Text variant="subtitle">
          Say goodbye to bridging assets, and hello to spanning ownership.
        </Text>

        {/* Action buttons */}
        <HStack spacing="2rem" justify="left">
          <ActionButton
            disableTooltip={!isDisabled}
            tooltipText="Log in with Metamask to enable"
            disableButton={isDisabled}
            buttonText={"Mint Tokens"}
            onButtonClick={() => {
              logEvent("mint_tokens_click");
              props.setPage(PageState.kTokens);
            }}
          />
          <ActionButton
            disableTooltip={!isDisabled}
            tooltipText="Log in with Metamask to enable"
            disableButton={isDisabled}
            buttonText={"Mint NFTs"}
            onButtonClick={() => {
              logEvent("mint_nfts_click");
              props.setPage(PageState.kNFTs);
            }}
          />
        </HStack>
      </VStack>
      <VStack w="45%" />
    </HStack>
  );
}
