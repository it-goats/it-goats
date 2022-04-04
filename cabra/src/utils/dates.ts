import { format, utcToZonedTime } from "date-fns-tz";

export const DATE_FORMAT = "dd.MM.yyyy";
export const TIME_FORMAT = "HH:mm";
export const DATE_TIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

export function getTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function formatDateTime(
  date?: Date | string | number | null,
  timeZone: string = getTimezone()
): string | null {
  if (!date) return null;

  return format(utcToZonedTime(date, timeZone), DATE_TIME_FORMAT, { timeZone });
}
