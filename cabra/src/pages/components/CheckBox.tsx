import tw, { TwStyle, styled } from "twin.macro";

import CheckboxBlankIcon from "remixicon-react/CheckboxBlankCircleLineIcon";
import CheckboxCheckedIcon from "remixicon-react/CheckboxCircleLineIcon";
import CheckboxMultiIcon from "remixicon-react/CheckboxMultipleLineIcon";
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
const Label = styled.label<{ size: Size }>`
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
    ${tw`hover:opacity-60`}
  }
`;

const resolveIcon = (
  status: TaskStatus,
  size: Size,
  disabled: boolean | undefined
) => {
  if (disabled) {
    return <DisabledIcon {...iconSizes[size]} />;
  }
  switch (status) {
    case TaskStatus.DONE:
      return <CheckboxCheckedIcon {...iconSizes[size]} />;
    case TaskStatus.TODO:
      return <CheckboxBlankIcon {...iconSizes[size]} />;
    case TaskStatus.INDIRECTLY_DONE:
      return <CheckboxMultiIcon {...iconSizes[size]} />;
  }
};

export default function Checkbox({
  id,
  size = "base",
  disabled,
  status,
  ...props
}: Props) {
  return (
    <>
      <Label
        id={id}
        size={size}
        onClick={(event) => event.stopPropagation()}
        data-tip
        data-for={id}
      >
        <StyledInput {...props} disabled={disabled} id={id} type="checkbox" />
        <span>{resolveIcon(status, size, disabled)}</span>
      </Label>
      {disabled && (
        <ReactTooltip id={id} place="bottom" effect="solid">
          Task is blocked by other task.
        </ReactTooltip>
      )}
    </>
  );
}
