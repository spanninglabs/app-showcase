import { Center, SimpleGrid, Spacer, Text, VStack } from "@chakra-ui/react";

import { NFTDetail } from "./nft/NFTDetail";
import { NFTMintCard } from "./nft/NFTMintCard";
import { nftName } from "../constants/nftContract";
import { useEffect } from "react";
import { useNFTOwners } from "./nft/NFTOwnerContext";

export function NFTPage() {
  const { currentSupply, owner, refreshSupplyInfo, refreshAllOwners } =
    useNFTOwners();

  useEffect(() => {
    refreshSupplyInfo();
  }, []);

  useEffect(() => {
    refreshAllOwners();
  }, [currentSupply]);

  return (
    <VStack w="100%" align="left">
      {/* Header text */}
      <Text variant="title">{`Multichain ${nftName} NFT Collection`}</Text>
      <Text variant="subtitle">
        {`This is the ${nftName} NFT collection - a natively multichain NFT
        collection. You can mint and own an NFT from any of the chains available
        on the testnet.`}
      </Text>
      <Text variant="subtitle" fontWeight="semibold">
        Note: Data is loaded directly from chain, so it may take a few moments.
        We promise it&apos;s worth the wait!
      </Text>
      <Spacer />

      {/* NFT gallery */}
      <Center>
        <SimpleGrid
          p="1rem"
          w="100%"
          minChildWidth="280px"
          spacing="20px"
          alignItems={"center"}
        >
          {/* Mint NFT */}
          <NFTMintCard />

          {/* Show NFT cards; render the list twice, once to show all owned NFTs,
          and once to show the remaining. We use this pattern since the owner of
          a given NFT isn't known immediately, so we defer visibility directly
          to the card itself. */}
          {/* Show owned NFTs */}
          {currentSupply !== undefined &&
            [...Array(currentSupply).keys()]
              .map((i) => (
                <NFTDetail
                  key={i}
                  nftId={i}
                  currentOwnerPromise={owner(i)}
                  showOwnedOnly={true}
                />
              ))
              .reverse()}

          {/* Show remaining NFTs */}
          {currentSupply !== undefined &&
            [...Array(currentSupply).keys()].map((i) => (
              <NFTDetail
                key={currentSupply + i}
                nftId={i}
                currentOwnerPromise={owner(i)}
                showOwnedOnly={false}
              />
            ))}
        </SimpleGrid>
      </Center>
    </VStack>
  );
}
