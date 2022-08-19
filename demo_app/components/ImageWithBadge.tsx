import { Badge, Center, HStack, Icon, Text } from "@chakra-ui/react";

import { HiStar } from "react-icons/hi";

export function OwnedBadge(props: { showBadge: boolean; text?: string }) {
  // Render the UI!
  return (
    <Center>
      <Badge
        borderRadius="lg"
        bg="brand.primaryFaded"
        p="0rem 0.25rem"
        border="1px"
        color="brand.primary"
        fontSize="sm"
        zIndex="2"
        hidden={!props.showBadge}
      >
        <HStack spacing="2px">
          <Center>
            <Icon as={HiStar} color="brand.primary" />
          </Center>
          <Text>{props.text}</Text>
        </HStack>
      </Badge>
    </Center>
  );
}
