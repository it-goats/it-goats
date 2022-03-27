import tw, { styled } from "twin.macro";

import { keyframes } from "@emotion/react";

const slide = keyframes`
  from {
    transform: translate(-100vw, 0);
  }

  to {
    transform: translate(100vw, 0);
  }
`;

const Container = styled.div`
  animation: ${slide} 10s linear infinite;
  ${tw`fixed top-20 left-0`}
`;

export default function RandomGoat() {
  return (
    <Container>
      <iframe
        src="//randomgoat.com/embed.php"
        width="480"
        height="360"
        frameBorder="0"
        id="random-goat-embed"
        allowFullScreen
      ></iframe>
    </Container>
  );
}
