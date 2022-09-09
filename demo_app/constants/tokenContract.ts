import DBUXJson from "./tokenAbi.json";
import { getSpanningAddress } from "@spanning/utils";
import { networkIds } from "./chains";

export const tokenName = "DBUX";
export const maxMintPerTxn = 1000;
export const tokenAbi = DBUXJson.abi;
// The Spanning Network allows a multichain apps to be deployed from a
// single chain. We only need to read data from the one source of truth contract
// on the Avalanche Fuji Network.
export const tokenSettlementChain = networkIds.get("Avalanche Fuji")!;
export const tokenLegacyAddress = "0xed6f943dbc46ce2A659089D4F049b9444Ef20742";
export const tokenAddress = getSpanningAddress(
  parseInt(tokenSettlementChain),
  tokenLegacyAddress
);
export const isTokenSettlementChain = (chainId: string) =>
  chainId === tokenSettlementChain;
