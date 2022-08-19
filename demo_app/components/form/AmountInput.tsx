import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";

interface AmountInputProps {
  // Form settings
  isInvalid: boolean;
  showHelperText: boolean;
  helperText?: string;
  inputType: "number" | "text";
  placeholderText?: string;
  disabled?: boolean;
  // Input settings
  value: number | string;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Right element settings
  showRightButton: boolean;
  rightButtonText?: string;
  rightButtonWidth?: string;
  onRightButtonClick?: () => void;
}

export function AmountInput(props: AmountInputProps) {
  // Render the UI!
  return (
    <FormControl isInvalid={props.isInvalid}>
      <InputGroup>
        {/* Amount input */}
        <Input
          disabled={props.disabled}
          p="1.5rem"
          size="md"
          border="2px"
          focusBorderColor="brand.primary"
          borderColor="brand.primary"
          type={props.inputType}
          placeholder={props.placeholderText}
          value={props.value}
          onChange={props.onValueChange}
        />

        {/* Right button */}
        {props.showRightButton && (
          <InputRightElement
            h="100%"
            w={props.rightButtonWidth ?? "25%"}
            pr="1rem"
          >
            <Button
              p="0rem 1rem"
              borderRadius="lg"
              border="0px"
              fontWeight="700"
              bg="brand.primaryFaded"
              color="brand.primary"
              boxShadow="inset 0px -1px 0.5px rgba(14, 14, 44, 0.4)"
              _hover={{}}
              onClick={props.onRightButtonClick}
            >
              <Text fontSize="0.75rem">{props.rightButtonText}</Text>
            </Button>
          </InputRightElement>
        )}
      </InputGroup>

      {/* Helper text */}
      {props.showHelperText && (
        <FormHelperText>{props.helperText}</FormHelperText>
      )}
    </FormControl>
  );
}
