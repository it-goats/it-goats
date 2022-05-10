import tw, { styled } from "twin.macro";

import { ITask } from "../../types/task";

interface Props {
  tasks: ITask[] | null;
  isLoading: boolean;
}

const Container = styled.div(tw`p-4 rounded-lg text-stone-50 bg-primary`);

function TasksCalendar({ isLoading, tasks }: Props) {
  if (isLoading) return <Container>Loading tasks</Container>;
  if (!tasks) return <Container>Oops! Error loading tasks.</Container>;

  return (
    <Container>
      {tasks.map(({ id, title }) => (
        <p key={id}>{title}</p>
      ))}
    </Container>
  );
}

export default TasksCalendar;
