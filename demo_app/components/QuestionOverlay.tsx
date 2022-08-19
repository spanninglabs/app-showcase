import {
  Box,
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";

import { IoMdHelpCircle } from "react-icons/io";
import { useSpanningWeb3Provider } from "./SpanningWeb3Context";

export function QuestionOverlay() {
  const { logEvent } = useSpanningWeb3Provider();

  // Render the UI!
  return (
    <Box position="fixed" left="35px" bottom="35px" zIndex="999">
      <Menu>
        {/* Question button */}
        <MenuButton
          as={Button}
          variant="navStyle"
          opacity="90%"
          _active={{ opacity: "100%" }}
          onClick={() => {
            logEvent("help_click");
          }}
        >
          <HStack justify="center">
            <Icon as={IoMdHelpCircle} color="brand.white" h="30px" w="30px" />
            <Text variant="subtitle" color="brand.white">
              Questions?
            </Text>
          </HStack>
        </MenuButton>
        <MenuList bg="brand.navSecondary" border="none" p="1rem">
          {/* Include hidden menu to prevent autofocus */}
          <MenuItem hidden />
          <VStack align="start" w="250px">
            {/* Helper text */}
            <Text color="brand.white" fontWeight="bold">
              Hey!
            </Text>
            <Text color="brand.white">
              Have questions or feedback for Spanning Labs? Please share!
            </Text>
          </VStack>
          <Spacer h="1rem" />

          {/* Feedback button */}
          <MenuItem
            as={Button}
            variant="questions"
            color="brand.white"
            _hover={{ color: "black" }}
            onClick={() => {
              logEvent("feedback_click");
              window.open("https://spanninglabs.typeform.com/to/KbkIdg4O");
            }}
          >
            SUBMIT BUGS/FEEDBACK
          </MenuItem>
          <Spacer h="0.5rem" />

          {/* Docs button */}
          <MenuItem
            as={Button}
            variant="questions"
            color="brand.white"
            _hover={{ color: "black" }}
            onClick={() => {
              logEvent("testnet_onboard_click");
              window.open("https://docs.spanning.network/docs/testnet-onboard");
            }}
          >
            TEST NETWORK SET UP
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}
