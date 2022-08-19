import Web3 from "web3";

export interface ChainInfo {
  /**
   * Plaintext, human-readable chain name
   */
  chainName: string;
  /**
   * Plaintext, human-readable chain currency name
   */
  currencyName: string;
  /**
   * Number of decimals in the coin
   */
  currencyDecimals: number;
  /**
   * Symbol of the chain's coin
   */
  tokenSymbol: string;
  /**
   * Address where SPAN is deployed on this chain
   */
  span_addr: string;
  /**
   * Address where a Spanning Delegate is deployed on this chain
   */
  delegate_addr: string;
  /**
   * RPC endpoint for the chain
   */
  rpc: string;
  /**
   * url for image
   */
  logo: string;
}
export interface ChainMap {
  [key: string]: ChainInfo;
}

const map: ChainMap = {
  "43113": {
    chainName: "Avalanche Fuji",
    currencyName: "",
    currencyDecimals: 18,
    tokenSymbol: "AVAX",
    span_addr: "0x4f87e79366083514292C6332E50B51Fc9b501740",
    delegate_addr: "0xa967f6232231f389AD3fD25424296E526F6a952A",
    rpc: "https://api.avax-test.network/ext/bc/C/rpc",
    logo: "images/logos/avalanche.png",
  },
  "4": {
    chainName: "Rinkeby",
    currencyName: "",
    currencyDecimals: 18,
    tokenSymbol: "RIN",
    span_addr: "0x042C169d7b747672722D3bCec03d9b8f35f2dFE7",
    delegate_addr: "0x267F2509B9c34f44304665889AE07809699Ff463",
    rpc: "https://rinkeby-light.eth.linkpool.io/",
    logo: "images/logos/ethereum.png",
  },
  "80001": {
    chainName: "Mumbai",
    currencyName: "",
    currencyDecimals: 18,
    tokenSymbol: "MATIC",
    span_addr: "0x91FeFfc4646EcCB5c707d64aF500FC101a692E48",
    delegate_addr: "0x11aECE6c394cDA0915f9B076329328Cc60F3A33A",
    rpc: "https://rpc-mumbai.maticvigil.com",
    logo: "images/logos/polygon.png",
  },
  /*"3": {
    chainName: "Ropsten",
    currencyName: "",
    currencyDecimals: 18,
    tokenSymbol: "rETH",
    span_addr: "0xDaA216e318032DC539dBc5AC85ebD0726B2D9702",
    delegate_addr: "0xec322bDaEeddF6d111F8bF2F1c3661266836B6D5",
    rpc: "https://rinkeby-light.eth.linkpool.io/",
    logo: "images/logos/ethereum.png",
  },
  "97": {
    chainName: "Binance Smart Chain",
    currencyName: "",
    currencyDecimals: 18,
    tokenSymbol: "BNB",
    span_addr: "0x1F7b92efa20e7EEc74df153a7b6911D48a01e4ce",
    delegate_addr: "0x24057DCF70a27De6A1335e308F7c14F78C625AAa",
    rpc: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    logo: "images/logos/binance.png",
  },
  "421611": {
    chainName: "Arbitrum Rinkeby",
    currencyName: "",
    currencyDecimals: 18,
    tokenSymbol: "ARETH",
    span_addr: "0x46c93c715280b3e4674CD2F570B827e91BfeF0b0",
    delegate_addr: "0xc07C03f5f7E1979ec4afC17c7221D57Cec114a6D",
    rpc: "https://rinkeby.arbitrum.io/rpc",
    logo: "images/logos/arbitrum.png",
  },*/
};

const reverseChainNameMapping = (obj: ChainMap) => {
  const reversed: Map<string, string> = new Map();
  Object.keys(obj).forEach((key) => {
    reversed.set(obj[key].chainName, key);
  });
  return reversed;
};

export const chains = Object.fromEntries(
  Object.entries(map).map(([chainId, chainInfo]) => [
    chainId,
    {
      ...chainInfo,
      web3: new Web3(new Web3.providers.HttpProvider(chainInfo.rpc)),
    },
  ])
);

export const numChains = Object.entries(map).length;
export const supportedChainIds = Object.keys(map);
export const networkIds: Map<string, string> = reverseChainNameMapping(map);

export function getLogo(chainId: string): string {
  if (!supportedChainIds.includes(chainId)) {
    return "favicon.ico";
  }
  return map[chainId].logo;
}

export function getDelegateAddress(chainId: string): string {
  if (!supportedChainIds.includes(chainId)) {
    return map[networkIds.get("Avalanche Fuji")!].delegate_addr;
  }
  return map[chainId].delegate_addr;
}

export function getName(chainId: string): string {
  return map[chainId].chainName;
}
