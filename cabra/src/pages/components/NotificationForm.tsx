import "twin.macro";

import tw, { styled } from "twin.macro";
import { useEffect, useState } from "react";

type Props = {
  onChange: (rrule: number | null) => void;
  value: number | null;
};

const inputStyles = tw`rounded-lg text-black bg-tertiary px-4 py-2`;

const Input = styled.input(inputStyles);
const Select = styled.select(inputStyles, tw`capitalize`);

enum Units {
  Minute = 1,
  Hour = 60,
  Day = 1440,
}

const unitText = {
  [Units.Minute]: "minutes",
  [Units.Hour]: "hours",
  [Units.Day]: "days",
};

function getDefaultUnit(value: number | null): Units {
  if (!value) return Units.Minute;
  if (value % Units.Day === 0) return Units.Day;
  if (value % Units.Hour === 0) return Units.Hour;
  return Units.Minute;
}

function NotificationForm({ onChange, value }: Props) {
  const [unit, setUnit] = useState<Units>(() => getDefaultUnit(value));
  const [notifyBefore, setNotifyBefore] = useState(() =>
    value ? value / unit : 10
  );
  const [hasNotification, setHasNotification] = useState(value !== null);

  useEffect(() => {
    onChange(hasNotification ? notifyBefore * unit : null);
  }, [hasNotification, onChange, notifyBefore, unit]);

  return (
    <div className="text-stone-50">
      <div tw="flex items-center">
        <label
          htmlFor="notification-checkbox"
          tw="text-gray-50 font-bold space-x-2 "
        >
          Notify:
        </label>
        <input
          checked={hasNotification}
          id="notification-checkbox"
          name="notification-checkbox"
          onChange={() => setHasNotification((r) => !r)}
          type="checkbox"
          tw="ml-2"
        />
        {hasNotification && (
          <div tw="flex items-center gap-4 text-white ml-4">
            <Input
              type="number"
              id="notify-before"
              name="notify-before"
              min={1}
              step={1}
              tw="w-20"
              value={notifyBefore}
              onChange={(e) => setNotifyBefore(+e.target.value || 1)}
            />
            <Select
              name="unit"
              tw="w-28"
              value={unit}
              onChange={(e) => setUnit(+e.target.value)}
            >
              {[Units.Minute, Units.Hour, Units.Day].map((unit) => (
                <option key={unit} value={unit}>
                  {unitText[unit]}
                </option>
              ))}
            </Select>

            <span>before</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationForm;
