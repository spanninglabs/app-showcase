import {
  CircularProgress,
  HStack,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";

import Confetti from "react-confetti";

interface TxnProcessProps {
  // Callout settings
  status: string;
  settled: boolean;
  showSuccess: boolean;
  showCrosschain: boolean;
  showSettlement: boolean;
  // Details settings
  showDetails: boolean;
  headline: string;
  transferFrom?: string;
  transferTo: string;
}

export function TxnProcess(props: TxnProcessProps) {
  // Render the UI!
  return (
    <VStack spacing="1rem">
      {/* Success info */}
      {props.showSuccess && (
        <>
          <Text variant="code" fontSize="2xl">
            REQUEST SUCCESSFUL!
          </Text>
          <Confetti
            style={{ position: "fixed" }}
            recycle={false}
            numberOfPieces={420}
          />
        </>
      )}

      {/* Crosschain info */}
      {props.showCrosschain && (
        <Text color="brand.fadedText">
          Did you know that this transaction was crosschain?
        </Text>
      )}
      {props.showCrosschain && !props.transferFrom && (
        <Text color="brand.fadedText">
          Your tokens are stored on another network.
        </Text>
      )}
      <Spacer />

      {/* Detail info */}
      {props.showDetails && (
        <VStack
          align="left"
          justify="space-between"
          bg="brand.primaryFaded"
          p="1rem"
          borderRadius="lg"
        >
          <Text variant="codeBlack">{props.headline}</Text>
          {props.transferFrom && (
            <HStack>
              <Text>from:</Text>
              <Text variant="codeBlack">{props.transferFrom}</Text>
            </HStack>
          )}
          <HStack>
            <Text>to:</Text>
            <Text variant="codeBlack">{props.transferTo}</Text>
          </HStack>
          <Spacer />
        </VStack>
      )}

      {/* Status info */}
      <StatusSpinner complete={props.settled} status={props.status} />

      {/* Settlement info */}
      {props.showSettlement &&
        (props.settled ? (
          <Text color="brand.fadedText" align="center">
            Destination settlement complete! Please close this modal.
          </Text>
        ) : (
          <Text color="brand.fadedText" align="center">
            Destination settlement may take a few moments. Feel free to close
            this modal.
          </Text>
        ))}
    </VStack>
  );
}

export function StatusSpinner(props: {
  complete: boolean;
  status: string;
  size?: string;
}) {
  // Render the UI!
  return (
    <HStack pb="0rem">
      {!props.complete && (
        <CircularProgress isIndeterminate size="1rem" color="brand.primary" />
      )}
      <Text color="brand.fadedText" fontWeight="bold" fontSize={props.size}>
        Current Status:
      </Text>
      <Text color="brand.fadedText" fontSize={props.size}>
        {props.status}
      </Text>
    </HStack>
  );
}
