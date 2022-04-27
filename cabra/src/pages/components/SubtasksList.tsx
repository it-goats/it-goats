import { getTask, getTasks, updateTask } from "../../api/tasks";
import tw, { styled } from "twin.macro";
import { useMutation, useQuery, useQueryClient } from "react-query";

import Checkbox from "./CheckBox";
import { ITask } from "../../types/task";
import { getSubtasks } from "../../api/taskRelations";
import { useState } from "react";

interface Props {
  subtask: ITask;
  parentId: string;
}

interface PropsList {
  parentId: string;
}

const Container = styled.div(tw`grid grid-cols-4 gap-3`);

const Subtask = ({ subtask, parentId }: Props) => {
  const [errorMessage, setErrorMessage] = useState("");
  const client = useQueryClient();
  const editTask = useMutation((task: ITask) => updateTask(task.id, task), {
    onSuccess: () => {
      client.invalidateQueries(getTasks.cacheKey);
      client.invalidateQueries(getTask.cacheKey(parentId));
      client.invalidateQueries(getSubtasks.cacheKey(parentId));
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
    <div tw="rounded-xl bg-tertiary text-secondary p-1.5 grid">
      <p tw="font-medium text-xs">{subtask.title}</p>
      <p tw="place-self-end">
        <Checkbox checked={subtask.isDone} onChange={handleIsDoneChange} />
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

  if (subtasks.length == 0) {
    return <Container>{"<No tasks>"}</Container>;
  }

  return (
    <Container>
      {subtasks.map((relation) => (
        <Subtask
          key={relation.relationId}
          subtask={relation.task}
          parentId={parentId}
        />
      ))}
    </Container>
  );
}
