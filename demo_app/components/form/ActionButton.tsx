import { Button, Flex, Tooltip } from "@chakra-ui/react";

interface ActionButtonProps {
  // Tooltip settings
  disableTooltip: boolean;
  tooltipText?: string;
  // Button settings
  disableButton: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

export function ActionButton(props: ActionButtonProps) {
  // Render the UI!
  return (
    <Flex justify="end" pt="1rem">
      {/* Hover tooltip  */}
      <Tooltip
        justifyContent="end"
        shouldWrapChildren
        label={props.tooltipText}
        isDisabled={props.disableTooltip}
      >
        {/* Action button */}
        <Button
          variant={props.disableButton ? "disabled" : "primary"}
          disabled={props.disableButton}
          onClick={props.onButtonClick}
        >
          {props.buttonText}
        </Button>
      </Tooltip>
    </Flex>
  );
}
