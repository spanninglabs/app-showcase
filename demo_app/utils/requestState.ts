export enum RequestState {
  kInputs = "Waiting on inputs (user)",
  kSourceAuth = "Waiting on source auth (wallet)",
  kSourceConfirmation = "Waiting on source confirmation (network)",
  kDestinationSettlement = "Waiting on destination settlement (network)",
  kCompleted = "Completed",
}
