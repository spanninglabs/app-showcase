import { useEffect, useState } from "react";

const useInjectedEvents = () => {
  const [chainId, setChainId] = useState<string | null>(null);

  useEffect(() => {
    window.ethereum
      ?.request({ method: "eth_chainId" })
      .then((chain: string) => {
        setChainId(chain);
      });
  });

  return {
    chainDecimal: chainId !== null ? parseInt(chainId, 16) : undefined,
  };
};

export { useInjectedEvents };
