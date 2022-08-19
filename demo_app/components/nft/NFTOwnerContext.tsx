import React, { useCallback, useContext, useEffect, useState } from "react";

import { useSpanningWeb3Provider } from "../SpanningWeb3Context";

interface NFTOwnerContextProps {
  // Map between NFT ID and owner address
  owners: Map<number, Promise<any>>;
  // Get owner of an NFT
  owner: (id: number) => Promise<any>;
  // Set owner of an NFT; gets overridden on subsequent refreshes.
  eagerlySetOwner: (id: number, newOwner: string) => void;
  refreshOwner: (id: number) => void;
  refreshAllOwners: () => void;

  // Number of currently minted NFTs in the collection
  currentSupply?: number;
  setCurrentSupply: (newSupply: number) => void;
  // Number of total NFTs in the collection
  totalSupply: number;
  setTotalSupply: (newTotalSupply: number) => void;
  // Refresh the supply info of the collection
  refreshSupplyInfo: () => void;
}

// Initialize an empty context
const NFTOwnerContext = React.createContext<NFTOwnerContextProps>(undefined!);

/**
 * @returns A provider to get data from the NFT contract
 *
 * This provider polls at a fixed interval (`refreshRate`) to get the latest
 * ownership/supply info from the contract. It can be thought of as a DB/cache
 * (e.g. this file is where you could plug in an alt Web3 DApp framework).
 */
export function NFTOwnerProvider({
  refreshRate,
  children,
}: {
  refreshRate: number;
  children: React.ReactNode;
}) {
  // Grab references to the Web3 concepts we need
  const { userSpanningAddress, nftContract } = useSpanningWeb3Provider();

  // Initialize the state info
  const [owners, setOwners] = useState<Map<number, Promise<any>>>(new Map());
  const [currentSupply, setCurrentSupply] = useState<number | undefined>();
  const [totalSupply, setTotalSupply] = useState<number>(0);

  // Callback to refresh supply info
  const fetchSupply = async () => {
    try {
      const newTotalSupply = await nftContract.totalSupply();
      const newCurrentSupply = await nftContract.currentSupply();

      setTotalSupply(newTotalSupply.toNumber());
      setCurrentSupply(newCurrentSupply.toNumber());
    } catch (e) {
      console.error(e);
    }
  };

  // Callback to refresh ownership info
  const fetchOwnership = useCallback(async () => {
    const newOwners: Map<number, Promise<any>> = new Map();
    for (let i = 0; i < (currentSupply ?? 0); i++) {
      // Wrap in try/catch to prevent errors in fetching data
      try {
        const nftOwner = nftContract.callStatic["ownerOfSpanning(uint256)"](i);
        newOwners.set(i, nftOwner);
      } catch (e: any) {
        console.error(e);
        newOwners.set(
          i,
          new Promise<any>(() => {
            return null;
          })
        );
      }
    }
    setOwners(newOwners);
  }, [userSpanningAddress, currentSupply]);

  const doSupplyRefresh = () => fetchSupply();
  const doOwnershipRefresh = () => fetchOwnership();

  // Timer to refresh the supply info
  useEffect(() => {
    const interval = setInterval(doSupplyRefresh, refreshRate);
    return () => clearInterval(interval);
  }, [doSupplyRefresh]);

  // Timer to refresh ownership info
  useEffect(() => {
    const interval = setInterval(doOwnershipRefresh, refreshRate * 2);
    return () => clearInterval(interval);
  }, [doOwnershipRefresh]);

  // Provider callbacks for refreshing the balance
  const refreshAllOwners = useCallback(doOwnershipRefresh, [
    doOwnershipRefresh,
  ]);
  const refreshSupplyInfo = useCallback(doSupplyRefresh, [doSupplyRefresh]);
  const eagerlySetOwner = useCallback(
    (id: number, newOwner: string) => {
      const newOwners = new Map(owners);
      // Dummy Promise to keep data homogeneous
      const ownerPromise = new Promise<any>(() => {
        return newOwner;
      });
      newOwners.set(id, ownerPromise);
      setOwners(newOwners);
    },
    [owners]
  );
  const owner = useCallback(
    (id: number) => {
      const lookupValue = owners.get(id);
      const ownerPromise = new Promise<any>(() => {
        return null;
      });
      return lookupValue || ownerPromise;
    },
    [owners]
  );
  const refreshOwner = useCallback(
    (id: number) => {
      const newOwners = new Map(owners);
      newOwners.set(id, nftContract.callStatic["ownerOfSpanning(uint256)"](id));
      setOwners(newOwners);
    },
    [owners]
  );

  return (
    <NFTOwnerContext.Provider
      value={{
        // Ownership info
        owners,
        owner,
        eagerlySetOwner,
        refreshOwner,
        refreshAllOwners,
        // Supply Info
        currentSupply,
        setCurrentSupply,
        totalSupply,
        setTotalSupply,
        refreshSupplyInfo,
      }}
    >
      {children}
    </NFTOwnerContext.Provider>
  );
}

// Convenience export for consuming the context
export function useNFTOwners() {
  return useContext(NFTOwnerContext);
}
