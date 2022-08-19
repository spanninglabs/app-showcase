import { Circle, Flex, HStack, Icon, Image, Tooltip } from "@chakra-ui/react";

import { BsJournalCode } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";
import { PageState } from "../utils/pageState";
import { PageTracker } from "./PageTracker";
import { WalletMenu } from "./WalletMenu";
import { useSpanningWeb3Provider } from "./SpanningWeb3Context";

interface NavigationBarProps {
  page: PageState;
  setPage: (page: PageState) => void;
}

export function NavigationBar(props: NavigationBarProps) {
  const { logEvent } = useSpanningWeb3Provider();

  return (
    <Flex
      justify="space-between"
      align="center"
      position="fixed"
      left="0px"
      top="0px"
      w="100%"
      h="75px"
      bg="brand.navPrimary"
      p="1rem 2rem"
      zIndex="991"
    >
      {/* Logo */}
      <Image
        src="images/logo_white.png"
        alt="logo"
        h="50px"
        onClick={() => {
          logEvent("home_logo_click");
          props.setPage(PageState.kHome);
        }}
      />

      {/* Navigation */}
      <PageTracker page={props.page} setPage={props.setPage} />

      {/* Right buttons */}
      <HStack spacing="10px">
        {/* Discord link */}
        <Tooltip label="Discord">
          <Circle
            bg="brand.navSecondary"
            size="50px"
            p="0rem"
            onClick={() => {
              logEvent("discord_click");
              window.open("https://discord.gg/3HGg6mwePz");
            }}
          >
            <Icon as={FaDiscord} color="brand.white" w="30px" h="30px" />
          </Circle>
        </Tooltip>

        {/* Dev docs link */}
        <Tooltip label="Developer Resources">
          <Circle
            bg="brand.navSecondary"
            size="50px"
            p="0rem"
            onClick={() => {
              logEvent("dev_docs_click");
              window.open("https://docs.spanning.network/");
            }}
          >
            <Icon as={BsJournalCode} color="brand.white" w="25px" h="25px" />
          </Circle>
        </Tooltip>

        {/* Wallet menu */}
        <WalletMenu />
      </HStack>
    </Flex>
  );
}
