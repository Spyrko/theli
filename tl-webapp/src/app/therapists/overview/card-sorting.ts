import { DateTime } from 'ts-luxon';
import { BusinessHours, DayOfWeekOrder, RequestStatus, RequestStatusOrder, TherapistCardTs } from 'shared';

export enum SortingAlgorithm {
  NAME = 'NAME',
  STATUS = 'STATUS',
  RELEVANCE = 'RELEVANCE',
}


/**
 * Sorts an array of TherapistCardTs based on the specified sorting algorithm.
 * @param algorithm - The sorting algorithm to use.
 * @returns {(cards: TherapistCardTs[]) => TherapistCardTs[]} A function that sorts the therapist cards according to the specified algorithm.
 */
export function sortBy(algorithm: SortingAlgorithm): (cards: TherapistCardTs[]) => TherapistCardTs[] {
  switch (algorithm) {
    case SortingAlgorithm.NAME:
      return sortByName;
    case SortingAlgorithm.STATUS:
      return sortByStatus;
    case SortingAlgorithm.RELEVANCE:
      return sortByRelevance;
    default:
      throw new Error(`Unknown sorting algorithm: ${algorithm}`);
  }
}

/**
 * Sorts an array of TherapistCardTs by name in ascending order.
 *
 * @param {TherapistCardTs[]} cards - The array of therapist cards to sort.
 * @returns {TherapistCardTs[]} A new array sorted by therapist names.
 */
function sortByName(cards: TherapistCardTs[]): TherapistCardTs[] {
  return cards.sort(
    (a: TherapistCardTs, b: TherapistCardTs): number => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      }
      return 0;
    }
  );
}

/**
 * Sorts an array of TherapistCardTs by request status.
 *
 * The sorting order is defined by the RequestStatusOrder enum:
 * 1. ACCEPTED
 * 2. NOT_REQUESTED
 * 3. REQUESTED
 * 4. WAITLISTED
 * 5. REJECTED
 *
 * @param {TherapistCardTs[]} cards - The array of therapist cards to sort.
 * @returns {TherapistCardTs[]} A new array sorted according to the request status.
 */
function sortByStatus(cards: TherapistCardTs[]): TherapistCardTs[] {
  return cards.sort(
    (a: TherapistCardTs, b: TherapistCardTs): number => {
      if (RequestStatusOrder[a.requestStatus] < RequestStatusOrder[b.requestStatus]) {
        return -1;
      } else if (RequestStatusOrder[a.requestStatus] > RequestStatusOrder[b.requestStatus]) {
        return 1;
      }
      return 0;
    }
  );
}

/**
 * Sorts an array of TherapistCardTs by relevance according to specific business rules.
 *
 * The sorting order is:
 * 1. ACCEPTED
 * 2. WAITLISTED with waitingTime before now (earlier waitingTime first)
 * 3. NOT_REQUESTED sorted by the soonest upcoming business hour (earlier first)
 * 4. REQUESTED
 * 5. WAITLISTED with waitingTime after now or no waitingTime (earlier waitingTime first,
 *    cards without waitingTime sorted last in this group)
 * 6. REJECTED
 *
 * @param {TherapistCardTs[]} cards - The array of therapist cards to sort.
 * @returns {TherapistCardTs[]} A new array sorted according to the described relevance.
 */
function sortByRelevance(cards: TherapistCardTs[]): TherapistCardTs[] {
  return [...cards].sort((a, b) => getScore(a) - getScore(b));
}

/**
 * Computes a numeric score for sorting a single TherapistCardTs.
 * Lower scores indicate higher relevance.
 *
 * @param {TherapistCardTs} card - The therapist card to score.
 * @returns {number} The computed score for sorting.
 */
function getScore(card: TherapistCardTs): number {
  const now = DateTime.now();

  switch (card.requestStatus) {
    case RequestStatus.ACCEPTED:
      return 0;

    case RequestStatus.WAITLIST_CLOSED_UNTIL:
    case RequestStatus.WAITLISTED:
      if (!card.waitingTime) {
        return 45;
      }
      const diffInMs = card.waitingTime.getTime() - now.toMillis();
      const diffInDays = diffInMs / ( 1000 * 60 * 60 * 24 );
      const score = normalize(diffInDays);
      if (card.waitingTime.getTime() < now.toMillis()) {
        return 11 - score;
      } else {
        return 40 + score;
      }

    case RequestStatus.NOT_REQUESTED:
      return 20 + getNextBusinessHourScore(card.contactTimes, now);

    case RequestStatus.REQUESTED:
      return 30;

    case RequestStatus.REJECTED:
      return 50;

    case RequestStatus.NOT_INTERESTED:
      return 60;
    default:
      return 100;
  }
}

/**
 * Normalizes a difference in days to a value between 0 (inclusive) and 1 (inclusive),
 *
 * Values below 0 will be taken as their absolute value.
 * Values below 1 are clamped to 0.
 *
 * @param {number} value - The value to normalize.
 * @returns {number} The normalized value between 0 and just below 1.
 */
function normalize(value: number): number {
  const _value = Math.floor(Math.abs(value));
  if (_value < 1) return 0
  const clamped = Math.max(1.5, _value);
  return 1 - ( 1 / clamped );
}

/**
 * Calculates a score offset for NOT_REQUESTED cards based on the soonest upcoming business hour.
 *
 * @param {BusinessHours[] | undefined} contactTimes - The array of business hours.
 * @param {DateTime} now - The current date and time.
 * @returns {number} 0 if no future business hour exists or the normalized score offset between 1 and just under 2.
 */
function getNextBusinessHourScore(contactTimes: BusinessHours[] | undefined, now: DateTime): number {
  if (!contactTimes || contactTimes.length === 0) return 1;

  const futureDiffs = contactTimes
    .map((entry) => getNextOpeningDiffInMinutes(entry, now))
    .filter((d): d is number => d !== undefined);

  if (futureDiffs.length === 0) return 0;

  const minDiff = Math.min(...futureDiffs);
  return normalize(minDiff) + 1;
}

/**
 * Computes the number of minutes from now until the next occurrence of the given opening time
 * on the specified day of the week.
 * If the opening time for this week is already past, calculates the next week's occurrence.
 *
 * @param {BusinessHours} entry - A single business hours entry containing dayOfWeek and openingTime.
 * @param {DateTime} now - The current date and time.
 * @returns {number | undefined} The number of minutes until the next opening time, or undefined if data is incomplete.
 */
function getNextOpeningDiffInMinutes(entry: BusinessHours, now: DateTime): number | undefined {
  const {openingTime, dayOfWeek} = entry;
  if (!openingTime || dayOfWeek === undefined) return undefined;

  const target = now.setZone(openingTime.zone)
    .startOf('day')
    .set({weekday: DayOfWeekOrder[dayOfWeek]})
    .plus({hours: openingTime.hour, minutes: openingTime.minute});

  const next = target < now ? target.plus({weeks: 1}) : target;
  return next.diff(now, 'minutes').minutes;
}
