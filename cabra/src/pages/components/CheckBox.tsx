import tw, { TwStyle, styled } from "twin.macro";

import CheckboxBlankIcon from "remixicon-react/CheckboxBlankCircleLineIcon";
import CheckboxCheckedIcon from "remixicon-react/CheckboxCircleLineIcon";
import CheckboxIndirectlyDoneIcon from "../../utils/indirectly_done_icon.svg";
import DisabledIcon from "remixicon-react/IndeterminateCircleLineIcon";
import { InputHTMLAttributes } from "react";
import ReactTooltip from "react-tooltip";
import { TaskStatus } from "../../types/task";

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "id" | "size"
> & {
  id: string;
  status: TaskStatus;
  blocked: boolean;
  size?: Size;
};
type Size = "sm" | "base" | "lg";

const StyledInput = styled.input(tw`absolute h-0 w-0 opacity-0`);

const labelSizes: Record<Size, TwStyle> = {
  sm: tw`w-7 h-7`,
  base: tw`w-9 h-9`,
  lg: tw`w-11 h-11`,
};

const iconSizes: Record<Size, { size: number }> = {
  sm: { size: 20 },
  base: { size: 24 },
  lg: { size: 28 },
};
const Label = styled.label<{ size: Size; blocked: boolean }>`
  ${tw`select-none`}

  span {
    ${tw`place-items-center rounded grid cursor-pointer`}
    ${tw`transition-all shadow-xl text-secondary bg-tertiary`}
    ${({ size }) => labelSizes[size]}
  }

  input:disabled ~ span {
    ${tw`bg-slate-500 cursor-auto`}
  }
  input:enabled ~ span {
    ${({ blocked }) => blocked && tw`bg-orange-300`}
    ${tw`hover:opacity-60`}
  }
`;

const resolveIcon = (status: TaskStatus, size: Size, disabled: boolean) => {
  if (disabled) {
    return <DisabledIcon {...iconSizes[size]} />;
  }
  switch (status) {
    case TaskStatus.DONE:
      return <CheckboxCheckedIcon {...iconSizes[size]} />;
    case TaskStatus.TODO:
      return <CheckboxBlankIcon {...iconSizes[size]} />;
    case TaskStatus.INDIRECTLY_DONE:
      return <img src={CheckboxIndirectlyDoneIcon} {...iconSizes[size]} />;
  }
};

const resolveTooltip = (status: TaskStatus, blocked: boolean) => {
  if (blocked) {
    if (status === TaskStatus.DONE) {
      return "Task is done but is blocked by not done task.";
    }
    return "Task is blocked by not done task.";
  }
  switch (status) {
    case TaskStatus.DONE:
      return "Task was done.";
    case TaskStatus.INDIRECTLY_DONE:
      return "Task was done indirectly by other task.";
    case TaskStatus.TODO:
      return "Task to do.";
  }
};

export default function Checkbox({
  id,
  size = "base",
  blocked,
  status,
  ...props
}: Props) {
  return (
    <>
      <Label
        id={id}
        size={size}
        blocked={blocked}
        onClick={(event) => event.stopPropagation()}
        data-tip
        data-for={id}
      >
        <StyledInput
          {...props}
          disabled={blocked && status !== TaskStatus.DONE}
          id={id}
          type="checkbox"
        />
        <span>
          {resolveIcon(status, size, blocked && status !== TaskStatus.DONE)}
        </span>
      </Label>
      <ReactTooltip id={id} place="bottom" effect="solid">
        {resolveTooltip(status, blocked)}
      </ReactTooltip>
    </>
  );
}
