import tw, { styled } from "twin.macro";

import { InputHTMLAttributes } from "react";

const StyledCheckboxInput = styled.input(
  tw`ml-auto flex items-center gap-2 p-2 rounded checked:bg-blue-500 checked:border-blue-500`
);

export default function Checkbox(
  props: Omit<InputHTMLAttributes<HTMLInputElement>, "type">
) {
  return <StyledCheckboxInput {...props} type="checkbox" />;
}
