import tw, { styled } from "twin.macro";

import { IFilterFormState } from "../../types/filterFormState";
import { ITask } from "../../types/task";
import TasksListPaginator from "./TasksListsPaginator";

const Container = styled.div(tw`text-gray-50 w-full space-y-4`);

interface Props {
  tasks: ITask[] | null;
  isLoading: boolean;
  filters: IFilterFormState;
}

export default function TasksList({ tasks, isLoading, filters }: Props) {
  if (isLoading) return <Container>Loading tasks</Container>;
  if (!tasks) return <Container>Oops! Error loading tasks.</Container>;

  const hasNoTasks = !tasks || tasks.length === 0;
  return (
    <Container>
      {hasNoTasks ? (
        <h1>Nothing found</h1>
      ) : (
        <TasksListPaginator items={tasks} filters={filters} />
      )}
    </Container>
  );
}
