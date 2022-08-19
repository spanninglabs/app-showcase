import {
  Center,
  Spacer,
  Tab,
  TabList,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { TokenMintPage } from "./token/TokenMintPage";
import { TokenTransferPage } from "./token/TokenTransferPage";
import { tokenName } from "../constants/tokenContract";
import { useSpanningWeb3Provider } from "./SpanningWeb3Context";

export function TokenPage() {
  const { logEvent } = useSpanningWeb3Provider();
  // Action options available for the token
  // Adding to this enum automatically adds the option to the tab group. You
  // must also conditionally add the expected page to the bottom of the VStack
  enum MethodOptions {
    Mint = "Mint",
    Transfer = "Transfer",
  }
  const [method, setMethod] = useState(MethodOptions.Mint);

  useEffect(() => {
    logEvent(`token_${method.toLowerCase()}_view`);
  }, [method]);

  // Render the UI!
  return (
    <VStack w="100%" align="left">
      {/* Header text */}
      <Text variant="title">{`Multichain \$${tokenName} tokens`}</Text>
      <Text variant="subtitle">
        Multi-chain tokens have the same value and utility no matter which chain
        the owner is using. Polygon, Ethereum, Binance, etc. users all have
        access to the same utility. Imagine what this may look like for DAO
        governance, frictionless multichain payments, and more!
      </Text>
      <Spacer />
      <Center>
        <VStack>
          <Tabs colorScheme="black" w="65%">
            <TabList>
              {/* Iterate the enum and create a tab for each option */}
              {Object.entries(MethodOptions).map(([key, value]) => (
                <Tab
                  key={key}
                  w={`${100 / Object.keys(MethodOptions).length}%`}
                  onClick={() => {
                    setMethod(value);
                  }}
                >
                  <Text variant="midtitle">{value}</Text>
                </Tab>
              ))}
            </TabList>
          </Tabs>
          <VStack
            w="600px"
            p="2rem"
            align="left"
            spacing="1rem"
            boxShadow="0px 1px 12px rgba(0, 0, 0, 0.5)"
            borderRadius="lg"
            bg="brand.primaryContrast"
          >
            {/* Render the appropriate page based on the selected tab */}
            {method === MethodOptions.Mint && <TokenMintPage />}
            {method === MethodOptions.Transfer && <TokenTransferPage />}
          </VStack>
        </VStack>
      </Center>
    </VStack>
  );
}
