import tw, { styled } from "twin.macro";

import { ITask } from "../types/task";
import Task from "./Task";
import axios from "axios";
import { useQuery } from "react-query";

const Container = styled.div(tw`text-gray-50 w-full space-y-4`);

export default function TasksList() {
  const { data, isLoading, error } = useQuery("tasks", () =>
    axios.get<ITask[]>("/tasks")
  );

  if (isLoading) return <Container>Loading</Container>;
  if (error || !data?.data) return <Container>Oops</Container>;

  const tasks = data.data.slice().reverse();

  return (
    <Container>
      {tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </Container>
  );
}