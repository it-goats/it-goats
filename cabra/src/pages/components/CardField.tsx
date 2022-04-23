import { ReactNode } from "react";
import styled from "@emotion/styled";
import tw from "twin.macro";

type Span = 1 | 2 | 3;
type Align = "left" | "center" | "right";

const Title = styled.div`
  ${tw`text-xs font-extrabold text-left`}
`;

const Field = styled.div<{ $span?: Span; $align?: Align }>`
  ${tw`bg-secondary rounded-lg p-2`}
  ${({ $span = 1, $align = "left" }) => `
    grid-column: span ${$span} / span ${$span};
    text-align: ${$align};
    `}
`;

interface Props {
  className?: string;
  children?: ReactNode;
  span?: Span;
  title?: string;
  align?: Align;
}

const CardField = ({ className, children, title, span, align }: Props) => (
  <Field className={className} $span={span} $align={align}>
    {title && <Title>{title}</Title>}
    {children}
  </Field>
);

export default CardField;
