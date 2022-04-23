import { getSubtasks, getTask, getTasks, updateTask } from "../../api/tasks";
import tw, { styled } from "twin.macro";
import { useMutation, useQuery, useQueryClient } from "react-query";

import Checkbox from "./CheckBox";
import { ITask } from "../../types/task";
import { useState } from "react";

interface Props {
  subtask: ITask;
}

interface PropsList {
  parentId: string;
}

const Container = styled.div(tw`text-gray-50 w-full space-y-4`);

const Subtask = ({ subtask }: Props) => {
  const [errorMessage, setErrorMessage] = useState("");
  const client = useQueryClient();
  const editTask = useMutation((task: ITask) => updateTask(task.id, task), {
    onSuccess: () => {
      client.invalidateQueries(getTasks.cacheKey);
      client.invalidateQueries(getTask.cacheKey(subtask.id));
    },
  });
  const handleIsDoneChange = async () => {
    try {
      const updatedTask = {
        ...subtask,
        isDone: !subtask.isDone,
      };
      await editTask.mutateAsync(updatedTask);
    } catch (error) {
      setErrorMessage(
        "Something went wrong :C, It's not possible to uncheck the task."
      );
    }
  };

  return (
    <div tw="rounded-xl w-full bg-white shadow-2xl text-blue-800  p-1.5">
      <p tw="flex items-center font-size[small]">
        {subtask.title}
        {<Checkbox checked={subtask.isDone} onChange={handleIsDoneChange} />}
      </p>
      {errorMessage && (
        <p tw="flex items-center text-orange-500 pt-1">&nbsp;{errorMessage}</p>
      )}
    </div>
  );
};

export default function SubtasksList({ parentId }: PropsList) {
  const { data, isLoading, error } = useQuery(
    getSubtasks.cacheKey(parentId),
    () => getSubtasks.run(parentId)
  );

  if (isLoading) return <Container>Loading</Container>;
  if (error) return <Container>Oops</Container>;
  if (!data?.data) return <Container />;

  const subtasks = data.data.slice().reverse();

  return (
    <Container>
      {subtasks.map((task) => (
        <Subtask key={task.id} subtask={task} />
      ))}
    </Container>
  );
}
