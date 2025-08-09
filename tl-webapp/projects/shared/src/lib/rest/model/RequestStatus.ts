export enum RequestStatus {
  NOT_REQUESTED = "NOT_REQUESTED",
  REQUESTED = "REQUESTED",
  WAITLISTED = "WAITLISTED",
  WAITLIST_CLOSED_UNTIL = "WAITLIST_CLOSED_UNTIL",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  NOT_INTERESTED = "NOT_INTERESTED",
}


export const RequestStatusOrder: Record<RequestStatus, number> = {
  [RequestStatus.ACCEPTED]: 0,
  [RequestStatus.NOT_REQUESTED]: 1,
  [RequestStatus.REQUESTED]: 2,
  [RequestStatus.WAITLISTED]: 3,
  [RequestStatus.WAITLIST_CLOSED_UNTIL]: 4,
  [RequestStatus.REJECTED]: 5,
  [RequestStatus.NOT_INTERESTED]: 6,
};
