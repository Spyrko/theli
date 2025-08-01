import { Contact } from "./Contact";
import { RequestStatus } from "./RequestStatus";
import { BusinessHours } from './BusinessHours';

export interface TherapistTs {
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
  waitingTime?: Date;

  /**
   * Contact history with the therapist.
   */
  contactHistory?: Contact[];

  /**
   * Name of the therapist.
   */
  name: string;

  /**
   * Specialization of the therapist.
   */
  specialization?: string;

  /**
   * Address of the therapist.
   */
  address: string;

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

  /**
   * Notes about the therapist.
   */
  notes?: string;

  /**
   * Rating of the therapist.
   */
  rating?: number;
}
