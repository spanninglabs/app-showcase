import { getSpanningAddress } from "@spanning/utils";
import jadeNFTJson from "./nftAbi.json";
import { networkIds } from "./chains";

export const nftName = "Jade";
export const nftMaxImages = 128;
export const nftAbi = jadeNFTJson.abi;
// The Spanning Network allows a multichain apps to be deployed from a
// single chain. We only need to read data from the one source of truth contract
// on the Avalanche Fuji Network.
export const nftSettlementChain = networkIds.get("Avalanche Fuji")!;
export const nftLegacyAddress = "0x8b6203dd90DDb61251baE83B40ad4822d1BB582d";
export const nftAddress = getSpanningAddress(
  parseInt(nftSettlementChain),
  nftLegacyAddress
);
export const isNftSettlementChain = (chainId: string) =>
  chainId === nftSettlementChain;
