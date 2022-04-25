import tw, { styled } from "twin.macro";

import { InputHTMLAttributes } from "react";

const StyledCheckboxInput = styled.input(
  tw`flex items-center gap-2 p-2 rounded checked:bg-blue-500 checked:border-blue-500`
);

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  className?: string;
};

export default function Checkbox(props: Props) {
  return <StyledCheckboxInput {...props} type="checkbox" />;
}
