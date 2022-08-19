import { Button, HStack, Image, Link, Text, VStack } from "@chakra-ui/react";

export function BOSPage() {
  return (
    <HStack
      w="100%"
      h="100%"
      minH="100vh"
      alignContent={"center"}
      justifyContent={"center"}
      spacing="0px"
      p="0rem 3rem"
    >
      <VStack w="55%">
        <Text variant="title" pb="1rem">
          Whoops, seems like we&apos;re down.
        </Text>
        <Text variant="subtitle">
          For status updates, check out{" "}
          <Link href="https://discord.gg/3HGg6mwePz">our discord.</Link>
        </Text>
        <Text variant="subtitle">
          For more information on Spanning Labs, check out{" "}
          <Link href="https://www.spanninglabs.com">our website.</Link>
        </Text>
        <Text variant="subtitle">
          For everything else, maybe it&apos;s time for a quick break.
        </Text>
      </VStack>
      <Image
        src="images/network_down.svg"
        alt="Network Down"
        w="25rem"
        ml="-15px"
      />
    </HStack>
  );
}

export function MetamaskPage() {
  return (
    <HStack
      w="100%"
      h="100%"
      minH="100vh"
      alignContent={"center"}
      justifyContent={"center"}
      spacing="0px"
      p="0rem 3rem"
    >
      <VStack w="55%">
        <Text variant="title" pb="1rem">
          Please Install Metamask.
        </Text>
        <Text variant="subtitle" pb="0.5rem">
          This website uses Injected Web3 wallets (such as Metamask) to operate
        </Text>
        <Button
          onClick={() => {
            window.open("https://metamask.io/");
          }}
        >
          Install
        </Button>
      </VStack>
      <Image
        src="images/metamask_install.svg"
        alt="Install Metamask"
        w="25rem"
        ml="-15px"
      />
    </HStack>
  );
}

export function MobilePage() {
  return (
    <VStack
      w="100%"
      h="100%"
      minH="100vh"
      alignContent={"center"}
      justifyContent={"center"}
      spacing="0px"
      p="0rem 3rem"
    >
      <Image
        src="images/desktop_only.svg"
        alt="Desktop Only"
        w="25rem"
        ml="-15px"
      />
      <Text variant="title" pb="1rem">
        Please visit this site on a desktop.
      </Text>
      <Text variant="subtitle" pb="0.5rem">
        The Spanning Labs Demo App isn&apos;t available on mobile at this time.
      </Text>
      <Text variant="subtitle" pb="0.5rem">
        Interested in partnering? Fill out this form.
      </Text>
      <Button
        onClick={() => {
          window.open(
            "https://spanninglabs.typeform.com/to/p2Fuv7EF#hubspot_utk=xxxxx&amp;hubspot_page_name=xxxxx&amp;hubspot_page_url=xxxxx"
          );
        }}
      >
        Partnership Form
      </Button>
    </VStack>
  );
}
