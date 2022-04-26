import tw, { styled } from "twin.macro";

import TasksListPaginator from "./TasksListsPaginator";
import { getTasks } from "../../api/tasks";
import { useQuery } from "react-query";

const Container = styled.div(tw`text-gray-50 w-full space-y-4`);

export default function TasksList() {
  const { data, isLoading, error } = useQuery(getTasks.cacheKey, getTasks.run);

  if (isLoading) return <Container>Loading</Container>;
  if (error || !data?.data) return <Container>Oops</Container>;

  const tasks = data.data;

  const hasNoTasks = !tasks || tasks.length == 0;
  return (
    <Container>
      {hasNoTasks ? (
        <h1>No tasks in your agenda. Go ahead, add one!</h1>
      ) : (
        <TasksListPaginator items={tasks} />
      )}
    </Container>
  );
}
