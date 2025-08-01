import { DayOfWeek } from './DayOfWeek';
import { DateTime } from 'ts-luxon';

/**
 * Represents the business hours of a therapist.
 * This entity defines the opening and closing times for each day of the week.
 */
export interface BusinessHours {
  /**
   * Unique identifier for the business hours entry.
   */
  id?: number;

  /**
   * Day of the week for which these business hours apply.
   */
  dayOfWeek?: DayOfWeek;

  /**
   * Opening time for the therapist on the specified day.
   * Format: "HH:mm" (24-hour format).
   */
  openingTime?: DateTime;

  /**
   * Closing time for the therapist on the specified day.
   * Format: "HH:mm" (24-hour format).
   */
  closingTime?: DateTime;
}
