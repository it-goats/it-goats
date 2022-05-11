import tw, { TwStyle, styled } from "twin.macro";

import { CheckCircleIcon } from "@heroicons/react/outline";
import { InputHTMLAttributes } from "react";
import ReactTooltip from "react-tooltip";

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "id" | "size"
> & {
  className?: string;
  id: string;
  size?: Size;
};
type Size = "sm" | "base" | "lg";

const StyledInput = styled.input(tw`absolute h-0 w-0 opacity-0`);

const labelSizes: Record<Size, TwStyle> = {
  sm: tw`w-7 h-7`,
  base: tw`w-9 h-9`,
  lg: tw`w-11 h-11`,
};

const iconSizes: Record<Size, { height: number; width: number }> = {
  sm: { height: 20, width: 20 },
  base: { height: 24, width: 24 },
  lg: { height: 28, width: 28 },
};

const Label = styled.label<{ size: Size }>`
  ${tw`select-none`}

  .checkmark {
    ${tw`place-items-center rounded grid cursor-pointer`}
    ${tw`bg-slate-300 text-slate-400 transition-all shadow-xl`}
    ${({ size }) => labelSizes[size]}
  }

  input:checked ~ .checkmark {
    ${tw`bg-success text-green-900`}
  }

  input:focus ~ .checkmark {
    ${tw`ring-2`}
  }

  input:disabled ~ .checkmark {
    ${tw`bg-red-700`}
  }

  input:enabled ~ .checkmark {
    ${tw`hover:opacity-60`}
  }
`;

export default function Checkbox({
  id,
  size = "base",
  disabled,
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
        <span className="checkmark">
          <CheckCircleIcon {...iconSizes[size]} />
        </span>
      </Label>
      {disabled && (
        <ReactTooltip id={id} place="bottom" effect="solid">
          Task is blocked by other task.
        </ReactTooltip>
      )}
    </>
  );
}
