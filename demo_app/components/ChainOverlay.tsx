import { Button, Spacer, Text, VStack } from "@chakra-ui/react";

import { NetworkSelectorItem } from "./form/NetworkSelector";
import { supportedChainIds } from "../constants/chains";
import { useSpanningWeb3Provider } from "./SpanningWeb3Context";

export function ChainOverlay() {
  // Web3 React hooks
  const { web3Enabled, onSupportedChain, switchChain, logEvent } =
    useSpanningWeb3Provider();

  if (!web3Enabled || onSupportedChain) {
    return null;
  }
  // Render the UI!
  return (
    <VStack
      bg="brand.navSecondary"
      borderRadius="lg"
      position="fixed"
      align="start"
      p="1rem"
      right="35px"
      bottom="35px"
      w="250px"
      zIndex="999"
    >
      {/* Helper text */}
      <Text color="brand.white" fontWeight="bold">
        Whoops!
      </Text>
      <Text color="brand.white">
        Looks like you&apos;re not connected to any of the test networks. Which
        one would you like to switch to?
      </Text>
      <Spacer />

      {/* Show chain options */}
      {supportedChainIds.map((chain) => (
        <Button
          key={chain}
          w="100%"
          justifyContent="start"
          _hover={{ bg: "brand.primaryFaded", color: "brand.primary" }}
        >
          <NetworkSelectorItem
            chainId={chain}
            onItemClick={() => {
              logEvent("switch_chain_click", { chain });
              switchChain(parseInt(chain));
            }}
          />
        </Button>
      ))}
    </VStack>
  );
}
