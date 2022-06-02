import "twin.macro";

import { PossibleEnds, PossibleFrequency } from "../../types/recurrenceRule";
import parseRecurrenceRule, {
  DEFAULT_RULE,
  serializeRecurrenceRule,
} from "../../utils/rrule";
import tw, { styled } from "twin.macro";
import { useEffect, useState } from "react";

import { DATE_FORMAT } from "../../utils/dates";
import DatePicker from "react-datepicker";

type Props = {
  onChange: (rrule: string | null) => void;
  value: string | null;
};

const endsKeys = ["NEVER", "COUNT", "UNTIL"] as const;
const endText = {
  [PossibleEnds.NEVER]: "Never",
  [PossibleEnds.COUNT]: "After",
  [PossibleEnds.UNTIL]: "On date",
};
const frequencyKeys = ["DAILY", "WEEKLY", "MONTHLY"] as const;
const frequencyText = {
  [PossibleFrequency.DAILY]: "day(s)",
  [PossibleFrequency.WEEKLY]: "week(s)",
  [PossibleFrequency.MONTHLY]: "month(s)",
};

const inputStyles = tw`rounded-lg text-black bg-tertiary px-4 py-2`;

const Input = styled.input(inputStyles);
const Select = styled.select(inputStyles, tw`capitalize`);

function RecurrenceForm({ onChange, value }: Props) {
  const [rule, setRule] = useState(() =>
    value !== null ? parseRecurrenceRule(value) : DEFAULT_RULE
  );
  const [isRecurrent, setIsRecurrent] = useState(value !== null);

  useEffect(() => {
    if (!isRecurrent) onChange(null);
    else onChange(serializeRecurrenceRule(rule));
  }, [isRecurrent, onChange, rule]);

  return (
    <div className="text-stone-50">
      <div tw="flex items-center">
        <label
          htmlFor="recurrence-checkbox"
          tw="text-gray-50 font-bold space-x-2 "
        >
          Recurrent Task:
        </label>
        <input
          checked={isRecurrent}
          id="recurrence-checkbox"
          name="recurrence-checkbox"
          onChange={() => setIsRecurrent((r) => !r)}
          type="checkbox"
          tw="ml-2"
        />
      </div>
      {isRecurrent && (
        <div tw="text-white font-semibold mt-2 space-y-2">
          <div tw="flex items-center gap-4">
            <label htmlFor="repeat">Repeat</label>
            <Select
              name="repeat"
              tw="w-28"
              value={rule.frequency}
              onChange={(e) =>
                setRule((r) => ({ ...r, frequency: +e.target.value }))
              }
            >
              {frequencyKeys.map((key) => (
                <option key={key} value={PossibleFrequency[key]}>
                  {key.toLowerCase()}
                </option>
              ))}
            </Select>
            <label htmlFor="interval">every</label>
            <Input
              type="number"
              id="interval"
              name="interval"
              min={1}
              step={1}
              tw="w-20"
              value={rule.interval}
              onChange={(e) =>
                setRule((r) => ({ ...r, interval: +e.target.value || 1 }))
              }
            />
            <span>{frequencyText[rule.frequency]}</span>
          </div>
          <div tw="flex items-center gap-4">
            <label htmlFor="repeat">End</label>
            <Select
              name="repeat"
              tw="w-32"
              value={rule.end}
              onChange={(e) => setRule((r) => ({ ...r, end: +e.target.value }))}
            >
              {endsKeys.map((key) => (
                <option key={key} value={PossibleEnds[key]}>
                  {endText[PossibleEnds[key]]}
                </option>
              ))}
            </Select>
            {rule.end === PossibleEnds.COUNT && (
              <>
                <Input
                  type="number"
                  id="interval"
                  name="interval"
                  min={1}
                  step={1}
                  tw="w-20"
                  value={rule.count}
                  onChange={(e) =>
                    setRule((r) => ({ ...r, count: +e.target.value || 1 }))
                  }
                />
                <label htmlFor="interval">occurrence(s)</label>
              </>
            )}
            {rule.end === PossibleEnds.UNTIL && (
              <div>
                <DatePicker
                  calendarStartDay={1}
                  dateFormat={DATE_FORMAT}
                  isClearable={false}
                  onChange={(date) =>
                    setRule((r) => ({ ...r, until: date ?? new Date() }))
                  }
                  selected={rule.until}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecurrenceForm;
