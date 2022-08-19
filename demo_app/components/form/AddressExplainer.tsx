import {
  Box,
  Center,
  HStack,
  Icon,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import {
  getShortLocalAddress,
  getSpanningAddress,
} from "@spanning/utils";

import { HiOutlineExternalLink } from "react-icons/hi";
import { IoMdCopy } from "react-icons/io";
import { ethers } from "ethers";
import { useSpanningWeb3Provider } from "../SpanningWeb3Context";

interface AddressExplainerProps {
  // Address settings
  inputNetwork: string;
  inputAddress: string;
}

export function AddressExplainer(props: AddressExplainerProps) {
  const { logEvent } = useSpanningWeb3Provider();
  const isInputAddressValid = ethers.utils.isAddress(props.inputAddress);

  // Render the UI!
  return (
    <VStack w="100%">
      {/* Diagram area */}
      <Box
        w="100%"
        borderRadius="lg"
        onClick={() => {
          const inputSpanningAddress = getSpanningAddress(
            parseInt(props.inputNetwork),
            props.inputAddress
          );
          logEvent("spanning_address_explainer_copy", { inputSpanningAddress });
          navigator.clipboard.writeText(inputSpanningAddress);
        }}
      >
        <HStack
          justify="space-between"
          spacing="0px"
          bg="brand.primaryFaded"
          p="1rem"
          borderRadius="lg"
        >
          <HStack justify="start" spacing="0px">
            <Text variant="code">{"// |"}</Text>
            <Text variant="code">
              {ethers.utils.hexZeroPad(
                `0x${parseInt(props.inputNetwork).toString(16)}`,
                4
              )}
            </Text>
            <Text variant="code"></Text>
            {!isInputAddressValid ? (
              <Text variant="code">|------|-------------------</Text>
            ) : (
              <Text variant="code">
                {"..." + getShortLocalAddress(props.inputAddress)}
              </Text>
            )}
            <Text variant="code">|</Text>
          </HStack>
          <Tooltip
            label={
              isInputAddressValid
                ? "Copy Spanning Address"
                : "Copy Incomplete Spanning Address"
            }
          >
            <Center>
              <Icon as={IoMdCopy} />
            </Center>
          </Tooltip>
        </HStack>
      </Box>

      {/* External link */}
      <HStack
        onClick={() => {
          logEvent("spanning_address_click");
          window.open("https://docs.spanning.network/docs/concepts/address");
        }}
        style={{ cursor: "pointer", width: "100%", padding: "0.5rem" }}
      >
        <Text justifyContent="end" borderBottom="dashed" size="sm">
          Learn about Spanning Addresses
        </Text>
        <Icon as={HiOutlineExternalLink} />
      </HStack>
    </VStack>
  );
}
