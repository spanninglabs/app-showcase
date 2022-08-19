import { Icon, Tab, TabList, Tabs } from "@chakra-ui/react";

import { HiOutlineHome } from "react-icons/hi";
import { PageState } from "../utils/pageState";
import { useEffect } from "react";
import { useSpanningWeb3Provider } from "./SpanningWeb3Context";

interface PageTrackerProps {
  page: PageState;
  setPage: (page: PageState) => void;
}

export function PageTracker(props: PageTrackerProps) {
  const { logEvent, account, chainId, web3Enabled } = useSpanningWeb3Provider();

  useEffect(() => {
    logEvent(`${props.page.toLowerCase()}_view`, {
      loggedIn: web3Enabled,
      chainId,
      account,
    });
  }, [props.page]);

  let expectedIndex = 0;
  switch (props.page) {
    case PageState.kHome:
      expectedIndex = 0;
      break;
    case PageState.kTokens:
      expectedIndex = 1;
      break;
    case PageState.kNFTs:
      expectedIndex = 2;
      break;
  }

  const tabStyle = {
    bg: "brand.navSecondary",
    color: "brand.white",
    borderColor: "brand.navSecondary",
    borderWidth: "2px",
    _selected: {
      bg: "brand.primaryFaded",
      color: "brand.primary",
      borderColor: "brand.primary",
    },
  };

  // Render the UI!
  return (
    <Tabs
      variant="solid-rounded"
      borderRadius="3xl"
      bg="brand.navSecondary"
      index={expectedIndex}
    >
      <TabList>
        {/* Home  */}
        <Tab
          {...tabStyle}
          onClick={() => {
            props.setPage(PageState.kHome);
          }}
        >
          <Icon as={HiOutlineHome} w="20px" h="20px" />
        </Tab>

        {/* Tokens */}
        <Tab
          {...tabStyle}
          w="150px"
          onClick={() => {
            props.setPage(PageState.kTokens);
          }}
        >
          {PageState.kTokens}
        </Tab>

        {/* NFTs */}
        <Tab
          {...tabStyle}
          w="150px"
          onClick={() => {
            props.setPage(PageState.kNFTs);
          }}
        >
          {PageState.kNFTs}
        </Tab>
      </TabList>
    </Tabs>
  );
}
