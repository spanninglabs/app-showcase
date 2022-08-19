import { useContractFunction } from "@usedapp/core";
import { useSpanningWeb3Provider } from "../components/SpanningWeb3Context";

export function useMakeRequest() {
  const { delegateContract } = useSpanningWeb3Provider();

  const { state, send } = useContractFunction(delegateContract, "makeRequest", {
    transactionName: "makeRequest",
  });

  return {
    makeRequest: send,
    txnStatus: state.status,
  };
}
