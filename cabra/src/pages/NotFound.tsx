import tw, { styled } from "twin.macro";

import { Link } from "react-router-dom";
import RandomGoat from "./components/RandomGoat";

const Container = styled.div`
  ${tw`flex flex-col items-center h-screen py-10 overflow-auto max-h-screen`}
  ${tw`bg-gradient-to-b from-blue-700 to-fuchsia-500`}
`;

export default function NotFoundPage() {
  return (
    <Container>
      <Link to="/">Take me home</Link>
      <RandomGoat />
    </Container>
  );
}
