import {
  Circle,
  HStack,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import {
  chains,
  getLogo,
  getName,
  supportedChainIds,
} from "../../constants/chains";

import { FiChevronDown } from "react-icons/fi";
import { useState } from "react";

interface NetworkSelectorProps {
  onNetworkChange: (newNetwork: string) => void;
}

export function NetworkSelector(props: NetworkSelectorProps) {
  // State for the selector
  const [selectedNetwork, setSelectedNetwork] = useState(supportedChainIds[0]);

  // Render the UI!
  return (
    <Menu size="sm" matchWidth>
      <MenuButton
        p="0.5rem 1rem"
        minW="100%"
        borderRadius="lg"
        borderWidth="2px"
        borderColor="brand.primary"
        // _active={{ borderWidth: "3px" }}
      >
        <HStack justify={"space-between"}>
          <NetworkSelectorItem chainId={selectedNetwork} />
          <Icon as={FiChevronDown} size="1.5rem" color="brand.primary" />
        </HStack>
      </MenuButton>
      <MenuList zIndex="999" borderWidth="medium" borderColor="brand.primary">
        {Object.keys(chains).map((key) => {
          return (
            <MenuItem
              key={key}
              onClick={() => {
                setSelectedNetwork(key);
                props.onNetworkChange(key);
              }}
            >
              <NetworkSelectorItem chainId={key} />
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

export function NetworkSelectorItem(props: {
  chainId: string;
  onItemClick?: () => void;
}) {
  const chainLogo = getLogo(props.chainId);
  const chainName = getName(props.chainId);
  return (
    <HStack spacing="1rem" onClick={props.onItemClick}>
      <Circle borderColor="brand.primary" borderWidth="2px" p="5px">
        <Image src={chainLogo} alt="Chain Logo" h="20px" />
      </Circle>
      <Text>{chainName}</Text>
    </HStack>
  );
}
