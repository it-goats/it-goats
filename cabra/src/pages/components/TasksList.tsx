import tw, { styled } from "twin.macro";

import TasksListPaginator from "./TasksListsPaginator";
import { compareAsc } from "date-fns";
import { getTasks } from "../../api/tasks";
import { useQuery } from "react-query";

const Container = styled.div(tw`text-gray-50 w-full space-y-4`);

export default function TasksList() {
  const { data, isLoading, error } = useQuery(getTasks.cacheKey, getTasks.run);

  if (isLoading) return <Container>Loading</Container>;
  if (error || !data?.data) return <Container>Oops</Container>;

  const tasks = data.data.slice().reverse();

  const tasksSortedByDueDate = tasks.sort((a, b) =>
    a.dueDate && b.dueDate
      ? compareAsc(new Date(a.dueDate), new Date(b.dueDate))
      : -1
  );

  return (
    <>
      {!tasks ||
        (tasks.length == 0 && (
          <h1>No tasks in your agenda. Go ahead, add one!</h1>
        ))}
      {tasks && tasks.length > 0 && (
        <TasksListPaginator items={tasksSortedByDueDate} />
      )}
    </>
  );
}
