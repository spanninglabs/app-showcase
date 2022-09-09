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
export const nftLegacyAddress = "0xe909E233c7fB9eDf137a9C561aBAE29156b5eC02";
export const nftAddress = getSpanningAddress(
  parseInt(nftSettlementChain),
  nftLegacyAddress
);
export const isNftSettlementChain = (chainId: string) =>
  chainId === nftSettlementChain;
