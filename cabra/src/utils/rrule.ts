import {
  PossibleEnds,
  PossibleFrequency,
  PossibleFrequencyValue,
  RecurrenceRule,
} from "../types/recurrenceRule";
import RRule, { rrulestr } from "rrule";

export const DEFAULT_RULE: RecurrenceRule = {
  frequency: PossibleFrequency.DAILY,
  interval: 1,
  end: PossibleEnds.NEVER,
  count: 1,
  until: new Date(),
};

export default function parseRecurrenceRule(rrule: string): RecurrenceRule {
  const rruleobj = rrulestr(rrule);
  return {
    frequency: rruleobj.options.freq as PossibleFrequencyValue,
    interval: rruleobj.options.interval,
    end: parsePossibleEnd(rruleobj),
    count: rruleobj.options.count ?? 1,
    until: rruleobj.options.until ?? new Date(),
  };
}

export function parsePossibleEnd({
  options: { until, count },
}: RRule): PossibleEnds {
  if (until) return PossibleEnds.UNTIL;
  if (count) return PossibleEnds.COUNT;
  return PossibleEnds.NEVER;
}

export function serializeRecurrenceRule({
  frequency,
  interval,
  end,
  count,
  until,
}: RecurrenceRule): string {
  return new RRule({
    freq: frequency,
    interval: interval,
    count: end === PossibleEnds.COUNT ? count : undefined,
    until: end === PossibleEnds.UNTIL ? until : undefined,
  }).toString();
}
