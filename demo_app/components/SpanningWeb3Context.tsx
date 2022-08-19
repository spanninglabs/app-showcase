import React, { useContext, useEffect, useState } from "react";
import {
  chains,
  getDelegateAddress,
  networkIds,
  supportedChainIds,
} from "../constants/chains";
import {
  getShortSpanningAddress,
  getSpanningAddress,
} from "@spanning/utils";
import { nftAbi, nftLegacyAddress } from "../constants/nftContract";
import { tokenAbi, tokenLegacyAddress } from "../constants/tokenContract";
import { useContractFunction, useEthers, useNetwork } from "@usedapp/core";

import { amplitude } from "../utils/amplitude";
import delegateAbi from "../constants/delegateAbi.json";
import { ethers } from "ethers";
import { useSwitchChain } from "../hooks/useSwitchChain";

interface SpanningWeb3ContextProps {
  // Base data
  account: string | undefined;
  chainId: number | undefined;

  // Convenience flags
  onSupportedChain: boolean;
  actionsEnabled: boolean;
  web3Enabled: boolean;

  // User
  userSpanningAddress: string | undefined;
  userShortSpanningAddress: string | undefined;

  // Wallet
  activateWallet: () => void;
  deactivateWallet: () => void;
  switchChain: (chainId: number) => void;

  // Delegate
  makeRequest: any;
  txnStatus: string;

  // Contracts
  nftContract: ethers.Contract;
  tokenContract: ethers.Contract;
  delegateContract: ethers.Contract;

  // Logging
  logEvent: any;
}

// Initialize an empty context
const SpanningWeb3Context = React.createContext<SpanningWeb3ContextProps>(
  undefined!
);

export function SpanningWeb3Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const logEvent = (...inputs: any[]) => {
    // Here is where you could switch to a different logging framework
    amplitude.getInstance().logEvent(...inputs);
  };
  // Grab references to the Web3 concepts we need
  const { activateBrowserWallet, deactivate, error } = useEthers();
  const account = useNetwork().network.accounts[0];
  const chainId = useNetwork().network.chainId;
  const { switchToChain } = useSwitchChain();

  const [web3Enabled, setWeb3Enabled] = useState(false);
  const [onSupportedChain, setOnSupportedChain] = useState(false);
  const [userSpanningAddress, setUserSpanningAddress] = useState<
    string | undefined
  >(undefined);
  const [userShortSpanningAddress, setUserShortSpanningAddress] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    setWeb3Enabled(
      chainId !== undefined && account !== undefined && account !== null
    );
  }, [account, chainId, error]);

  useEffect(() => {
    if (chainId !== undefined) {
      setOnSupportedChain(
        web3Enabled && supportedChainIds.includes(chainId.toString())
      );
    }
  }, [web3Enabled, chainId]);

  useEffect(() => {
    if (chainId !== undefined && account !== undefined) {
      setUserSpanningAddress(
        onSupportedChain ? getSpanningAddress(chainId, account) : undefined
      );
      setUserShortSpanningAddress(
        onSupportedChain ? getShortSpanningAddress(chainId, account) : undefined
      );
    }
  }, [onSupportedChain, chainId, account]);

  const switchChain = (chainId: number) => {
    switchToChain(chainId.toString());
  };

  const [provider] = useState<ethers.providers.Provider>(
    new ethers.providers.JsonRpcProvider(
      chains[networkIds.get("Avalanche Fuji")!].rpc
    )
  );
  const [nftContract] = useState<ethers.Contract>(
    new ethers.Contract(nftLegacyAddress, nftAbi, provider)
  );
  const [tokenContract] = useState<ethers.Contract>(
    new ethers.Contract(tokenLegacyAddress, tokenAbi, provider)
  );

  const [delegateContract, setDelegateContract] = useState<ethers.Contract>(
    new ethers.Contract(
      getDelegateAddress(networkIds.get("Avalanche Fuji")!),
      delegateAbi.abi
    )
  );

  const { state, send } = useContractFunction(delegateContract, "makeRequest", {
    transactionName: "makeRequest",
  });

  useEffect(() => {
    if (chainId !== undefined) {
      setDelegateContract(
        new ethers.Contract(
          getDelegateAddress(chainId.toString()),
          delegateAbi.abi
        )
      );
    }
  }, [chainId]);

  useEffect(() => {
    if (chainId) {
      logEvent("metamask_network_change", { chainId });
    }
  }, [chainId]);
  useEffect(() => {
    if (account) {
      logEvent("metamask_account_change", { account });
    }
  }, [account]);
  useEffect(() => {}, [account]);

  return (
    <SpanningWeb3Context.Provider
      value={{
        // Base data
        account,
        chainId,
        // Convenience flags
        onSupportedChain,
        actionsEnabled: onSupportedChain,
        web3Enabled,
        // User
        userSpanningAddress,
        userShortSpanningAddress,
        // Wallet
        activateWallet: activateBrowserWallet,
        deactivateWallet: deactivate,
        switchChain,
        // Delegate
        makeRequest: send,
        txnStatus: state.status,
        // Contracts
        nftContract,
        tokenContract,
        delegateContract,
        // Logging
        logEvent,
      }}
    >
      {children}
    </SpanningWeb3Context.Provider>
  );
}

// Convenience export for consuming the context
export function useSpanningWeb3Provider() {
  return useContext(SpanningWeb3Context);
}
