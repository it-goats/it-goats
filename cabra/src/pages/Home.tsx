import tw, { styled } from "twin.macro";

import RandomGoat from "./components/RandomGoat";
import TaskForm from "./components/TaskForm";
import TasksList from "./components/TasksList";

const Container = styled.div`
  ${tw`flex flex-col items-center h-screen py-10 overflow-auto max-h-screen`}
  ${tw`bg-gradient-to-b from-blue-700 to-fuchsia-500`}
`;

export default function HomePage() {
  return (
    <>
      <Container>
        <div tw="w-[90%] max-w-xl space-y-6 relative z-10">
          <TaskForm />
          <TasksList />
        </div>
      </Container>
      <RandomGoat />
    </>
  );
}
