import { BusinessHours, RequestStatus } from 'shared';
import { DateTime } from 'ts-luxon';

export interface TherapistCardTs {
  /**
   * Unique identifier for the therapist.
   */
  id?: number;

  /**
   * Status of the request to the therapist.
   */
  requestStatus?: RequestStatus;

  /**
   * Waiting time for the therapist.
   */
  waitingTime?: DateTime;

  /**
   * Name of the therapist.
   */
  name: string;

  /**
   * Specialization of the therapist.
   */
  specialization?: string;

  /**
   * Phone number of the therapist.
   */
  phoneNumber?: string;

  /**
   * Email address of the therapist.
   */
  emailAddress?: string;

  /**
   * Contact times of the therapist.
   */
  contactTimes?: BusinessHours[];
}
