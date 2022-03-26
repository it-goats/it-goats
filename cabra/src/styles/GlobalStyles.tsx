import tw, { GlobalStyles as BaseStyles, css, theme } from "twin.macro";

import { Global } from "@emotion/react";

const customStyles = css({
  body: {
    WebkitTapHighlightColor: theme`colors.purple.500`,
    ...tw`antialiased`,
  },
});

export default function GlobalStyles() {
  return (
    <>
      <BaseStyles />
      <Global styles={customStyles} />
    </>
  );
}
