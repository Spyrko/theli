export enum RequestStatus {
  NOT_REQUESTED = "NOT_REQUESTED",
  REQUESTED = "REQUESTED",
  WAITLISTED = "WAITLISTED",
  REJECTED = "REJECTED",
  ACCEPTED = "ACCEPTED",
}


export const RequestStatusOrder: Record<RequestStatus, number> = {
  [RequestStatus.ACCEPTED]: 0,
  [RequestStatus.NOT_REQUESTED]: 1,
  [RequestStatus.REQUESTED]: 2,
  [RequestStatus.WAITLISTED]: 3,
  [RequestStatus.REJECTED]: 4,
};
