import { Portal, VStack } from "@chakra-ui/react";

import { ChainOverlay } from "../components/ChainOverlay";
import { ContractBalanceProvider } from "../components/ContractBalanceContext";
import { DAppProvider } from "@usedapp/core";
import { IntroPage } from "../components/IntroPage";
import { NFTOwnerProvider } from "../components/nft/NFTOwnerContext";
import { NFTPage } from "../components/NFTPage";
import { NavigationBar } from "../components/NavigationBar";
import type { NextPage } from "next";
import { PageState } from "../utils/pageState";
import { QuestionOverlay } from "../components/QuestionOverlay";
import { SpanningWeb3Provider } from "../components/SpanningWeb3Context";
import { TokenPage } from "../components/TokenPage";
import { useInjectedEvents } from "../hooks/useInjectedEvents";
import { useState } from "react";

const Home: NextPage = () => {
  // Keep track of the currently shown page
  const [page, setPage] = useState(PageState.kHome);
  const { chainDecimal } = useInjectedEvents();

  // Render the UI!
  return (
    // This is a hack to make sure every chain a user switches to is valid
    <DAppProvider config={{ readOnlyChainId: chainDecimal }}>
      <SpanningWeb3Provider>
        {/* Navigation */}
        <NavigationBar page={page} setPage={setPage} />

        {/* Page content */}
        <ContractBalanceProvider refreshRate={750 /* ms */}>
          <VStack
            p="2rem 3rem"
            pt="calc(2rem + 75px)"
            pb="125px"
            w="100%"
            h="100%"
            minH="100vh"
            justify={page === PageState.kHome ? "center" : "flex-start"}
          >
            {page === PageState.kHome && <IntroPage setPage={setPage} />}
            {page === PageState.kTokens && <TokenPage />}
            {page === PageState.kNFTs && (
              <NFTOwnerProvider refreshRate={3000 /* ms */}>
                <NFTPage />
              </NFTOwnerProvider>
            )}
          </VStack>
        </ContractBalanceProvider>

        {/* Overlays */}
        <Portal>
          <QuestionOverlay />
          <ChainOverlay />
        </Portal>
      </SpanningWeb3Provider>
    </DAppProvider>
  );
};

export default Home;
