import { Frequency } from "rrule";

export const PossibleFrequency = {
  DAILY: Frequency.DAILY,
  WEEKLY: Frequency.WEEKLY,
  MONTHLY: Frequency.MONTHLY,
} as const;

export type PossibleFrequencyValue =
  typeof PossibleFrequency[keyof typeof PossibleFrequency];

export enum PossibleEnds {
  UNTIL,
  COUNT,
  NEVER,
}

export interface RecurrenceRule {
  frequency: PossibleFrequencyValue;
  interval: number;
  end: PossibleEnds;
  count: number;
  until: Date;
}
