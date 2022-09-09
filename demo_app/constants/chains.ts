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
    span_addr: "0xE9e14F0b1719864d374BA218f54d54d0c06c2FC9",
    delegate_addr: "0xaaFEC4A749178a8997bC1FcCD6C643cBA9aB00dE",
    rpc: "https://api.avax-test.network/ext/bc/C/rpc",
    logo: "images/logos/avalanche.png",
  },
  "4": {
    chainName: "Rinkeby",
    currencyName: "",
    currencyDecimals: 18,
    tokenSymbol: "RIN",
    span_addr: "0x32B45c147885D437C4d81AD413f08BCc997d813f",
    delegate_addr: "0x8a496F591f8be1aBc0BD813A651381F1A63867f1",
    rpc: "https://rinkeby-light.eth.linkpool.io/",
    logo: "images/logos/ethereum.png",
  },
  "80001": {
    chainName: "Mumbai",
    currencyName: "",
    currencyDecimals: 18,
    tokenSymbol: "MATIC",
    span_addr: "0x519366617027A524e4F1333AC3Ab597Ae89585A0",
    delegate_addr: "0x2fd08c501F7fDF7e917b562C47Ba78dFD67B06D1",
    rpc: "https://rpc-mumbai.maticvigil.com",
    logo: "images/logos/polygon.png",
  },
  "5": {
    chainName: "Goerli",
    currencyName: "",
    currencyDecimals: 18,
    tokenSymbol: "gETH",
    span_addr: "0x5c62eDfb4807736270707eE9B6ae8fc56aa1976A",
    delegate_addr: "0x9cFA1308acc48006d6fbB28DF79018E9FD04d322",
    rpc: "https://rpc.ankr.com/eth_goerli",
    logo: "images/logos/ethereum-light.png",
  },
  /*"3": {
    chainName: "Ropsten",
    currencyName: "",
    currencyDecimals: 18,
    tokenSymbol: "rETH",
    span_addr: "0x694655c67369dAF0962ebBf49C6dA21634e50Cf8",
    delegate_addr: "0xbB12BD3C414Fb4aa5101F79dA63308DA6d01Cdf6",
    rpc: "https://rinkeby-light.eth.linkpool.io/",
    logo: "images/logos/ethereum.png",
  },
  "97": {
    chainName: "Binance Smart Chain",
    currencyName: "",
    currencyDecimals: 18,
    tokenSymbol: "BNB",
    span_addr: "0x8E9C95D8e90C3c623c4FF5300E4eef887137ce0a",
    delegate_addr: "0xBB8030C10bA219b21Fe1545FB21E0F555B12418C",
    rpc: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    logo: "images/logos/binance.png",
  },
  "421611": {
    chainName: "Arbitrum Rinkeby",
    currencyName: "",
    currencyDecimals: 18,
    tokenSymbol: "ARETH",
    span_addr: "0xBB8030C10bA219b21Fe1545FB21E0F555B12418C",
    delegate_addr: "0x48DEFe87F7f1C5BA15a1e8bd3817BD4d2d1782e8",
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
