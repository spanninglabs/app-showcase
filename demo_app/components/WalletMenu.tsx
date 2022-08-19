import {
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { IoMdCopy } from "react-icons/io";
import { NetworkSelectorItem } from "./form/NetworkSelector";
import { supportedChainIds } from "../constants/chains";
import { useSpanningWeb3Provider } from "./SpanningWeb3Context";

export function WalletMenu() {
  const {
    activateWallet,
    deactivateWallet,
    web3Enabled,
    onSupportedChain,
    switchChain,
    userSpanningAddress,
    userShortSpanningAddress,
    logEvent,
  } = useSpanningWeb3Provider();

  const enum WalletState {
    kWeb3Disconnected,
    kOnWrongChain,
    kActionsEnabled,
  }
  const [walletState, setWalletState] = useState(WalletState.kWeb3Disconnected);
  const [walletText, setWalletText] = useState<string>();

  // Change state based on web3 enabled and on correct chain
  useEffect(() => {
    if (!web3Enabled) {
      // Web3 is not enabled
      setWalletText("Connect Wallet");
      setWalletState(WalletState.kWeb3Disconnected);
    } else if (!onSupportedChain) {
      // Web3 active but not active on correct chain
      setWalletText("Switch Chain");
      setWalletState(WalletState.kOnWrongChain);
    } else {
      // Actions enabled
      setWalletText(userShortSpanningAddress);
      setWalletState(WalletState.kActionsEnabled);
    }
  }, [web3Enabled, onSupportedChain, userShortSpanningAddress]);

  // Render the UI!
  return (
    <Menu matchWidth>
      {/* Main nav button */}
      <MenuButton
        as={Button}
        variant="primary"
        w="250px"
        _hover={{ bg: "brand.primaryFaded", color: "brand.primary" }}
        onClick={() => {
          logEvent("wallet_click");
        }}
      >
        {walletText}
      </MenuButton>
      <MenuList bg="brand.navSecondary" border="none" p="1rem 0.5rem">
        {/* Include hidden menu to prevent autofocus */}
        <MenuItem hidden />

        {/* Disconnected view */}
        {walletState === WalletState.kWeb3Disconnected && (
          <>
            <MenuItem
              borderRadius="lg"
              color="brand.white"
              _hover={{ bg: "brand.primaryFaded", color: "brand.primary" }}
              onClick={() => {
                activateWallet();
              }}
            >
              Connect with Metamask
            </MenuItem>
            <Spacer h="0.5rem" />
          </>
        )}

        {/* Switch chain view */}
        {walletState === WalletState.kOnWrongChain &&
          supportedChainIds.map((chain) => (
            <MenuItem
              key={chain}
              borderRadius="lg"
              color="brand.white"
              p="0.5rem"
              _hover={{ bg: "brand.primaryFaded", color: "brand.primary" }}
            >
              <NetworkSelectorItem
                chainId={chain}
                onItemClick={() => {
                  logEvent("wallet_switch_chain_click", { chain });
                  switchChain(parseInt(chain));
                }}
              />
            </MenuItem>
          ))}

        {/* Connected view */}
        {walletState === WalletState.kActionsEnabled && (
          <Tooltip label="Copy Spanning Address">
            <VStack
              p="0rem 1rem"
              align="start"
              onClick={() => {
                logEvent("spanning_address_wallet_copy", {
                  userSpanningAddress,
                });
                navigator.clipboard.writeText(userSpanningAddress!);
              }}
            >
              <HStack w="100%" justifyContent="space-between">
                <Text color="brand.white" fontWeight="bold">
                  Spanning Address
                </Text>
                <Icon as={IoMdCopy} color="brand.white" />
              </HStack>
              <Text color="brand.white">{userShortSpanningAddress!}</Text>
              <Spacer />
            </VStack>
          </Tooltip>
        )}

        {/* Disconnect button */}
        {walletState === WalletState.kActionsEnabled && (
          <>
            <MenuDivider color="brand.white" />
            <MenuItem
              as={Button}
              justifyContent="space-around"
              color="brand.white"
              onClick={() => {
                deactivateWallet();
              }}
            >
              Disconnect
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
}
