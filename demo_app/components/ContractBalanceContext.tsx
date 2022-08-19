import React, { useContext, useEffect, useState } from "react";

import { ethers } from "ethers";
import { useSpanningWeb3Provider } from "./SpanningWeb3Context";

interface ContractBalanceContextProps {
  // Token Info
  // Amount of tokens owned by the user
  tokenBalance: number;
  // Set the tokens balance of the user; gets overridden on following refreshes
  eagerlySetTokenBalance: (newBalance: number) => void;
  // Force refresh the tokens balance owned by the user
  refreshTokenBalance: () => void;

  // NFT Info
  // Amount of NFTs owned by the user
  nftBalance: number;
  // Set the NFT balance of the user; gets overridden on following refreshes
  eagerlySetNftBalance: (newBalance: number) => void;
  // Force refresh the NFT balance owned by the user
  refreshNftBalance: () => void;
}

// Initialize an empty context
const ContractBalanceContext = React.createContext<ContractBalanceContextProps>(
  undefined!
);

/**
 * @returns A provider to get data from the Token and NFT contracts
 *
 * This provider polls at a fixed interval (`refreshRate`) to get the latest
 * balance info from the contracts. It can be thought of as a DB/cache (e.g.
 * this file is where you could plug in an alt Web3 DApp framework).
 */
export function ContractBalanceProvider({
  refreshRate,
  children,
}: {
  refreshRate: number;
  children: React.ReactNode;
}) {
  // Grab references to the Web3 concepts we need
  const { userSpanningAddress, tokenContract, nftContract, logEvent } =
    useSpanningWeb3Provider();

  // Initialize the state info
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [nftBalance, setNftBalance] = useState<number>(0);

  useEffect(() => {
    if (tokenBalance > 0) {
      logEvent("token_balance_change", { tokenBalance });
    }
  }, [tokenBalance]);
  useEffect(() => {
    if (nftBalance > 0) {
      logEvent("nft_balance_change", { nftBalance });
    }
  }, [nftBalance]);

  // Callback to refresh balance info
  const doBalanceRefresh = async (
    setBalance: (balance: number) => void,
    contract: ethers.Contract
  ) => {
    // Bail out early if we don't have all the data
    if (contract === undefined || userSpanningAddress === undefined) {
      return;
    }
    try {
      // Get the balance from the contract
      const newBalance = await contract.callStatic["balanceOf(bytes32)"](
        userSpanningAddress
      );

      // Set the balance
      setBalance(newBalance.toNumber());
    } catch (e) {
      console.error(e);
    }
  };

  // Timer to refresh the token balance info
  useEffect(() => {
    const interval = setInterval(() => {
      doBalanceRefresh(setTokenBalance, tokenContract);
    }, refreshRate);
    return () => clearInterval(interval);
  }, [setTokenBalance, tokenContract, userSpanningAddress, refreshRate]);

  // Timer to refresh the NFT balance info
  useEffect(() => {
    const interval = setInterval(() => {
      doBalanceRefresh(setNftBalance, nftContract);
    }, refreshRate);
    return () => clearInterval(interval);
  }, [setNftBalance, nftContract, userSpanningAddress, refreshRate]);

  // Functions required for the context
  const eagerlySetTokenBalance = setTokenBalance;
  const eagerlySetNftBalance = setNftBalance;
  const refreshTokenBalance = () => {
    doBalanceRefresh(setTokenBalance, tokenContract);
  };
  const refreshNftBalance = () => {
    doBalanceRefresh(setNftBalance, nftContract);
  };

  return (
    <ContractBalanceContext.Provider
      value={{
        // Token Info
        tokenBalance,
        eagerlySetTokenBalance,
        refreshTokenBalance,
        // NFT Info
        nftBalance,
        eagerlySetNftBalance,
        refreshNftBalance,
      }}
    >
      {children}
    </ContractBalanceContext.Provider>
  );
}

// Convenience export for consuming the context
export function useContractBalance() {
  return useContext(ContractBalanceContext);
}
