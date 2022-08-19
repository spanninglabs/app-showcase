import { HStack, Text } from "@chakra-ui/react";

import { tokenName } from "../../constants/tokenContract";
import { useContractBalance } from "../ContractBalanceContext";

export function TokenBalance() {
  const { tokenBalance } = useContractBalance();

  // Render the UI!
  return (
    <HStack>
      <Text>Wallet Balance:</Text>
      <Text fontWeight="bold">{tokenBalance.toString()}</Text>
      <Text>{tokenName}</Text>
    </HStack>
  );
}
