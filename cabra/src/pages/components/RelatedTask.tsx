import { getTask, getTasks, updateTask } from "../../api/tasks";
import tw, { styled } from "twin.macro";
import { useMutation, useQueryClient } from "react-query";

import Checkbox from "./CheckBox";
import { DirectedRelationType } from "../../types/taskRelation";
import { ITask } from "../../types/task";
import { getRelatedTasks } from "../../api/taskRelations";
import { useState } from "react";

interface Props {
  task: ITask;
  relationType: DirectedRelationType;
  parentTaskId: string;
}

const Container = styled.div(
  tw`rounded-xl bg-tertiary text-secondary m-1.5 p-1.5 grid`
);

export default function RelatedTask({
  task,
  relationType,
  parentTaskId,
}: Props) {
  const [errorMessage, setErrorMessage] = useState("");
  const client = useQueryClient();
  const editTask = useMutation((task: ITask) => updateTask(task.id, task), {
    onSuccess: () => {
      client.invalidateQueries(getTasks.cacheKey);
      client.invalidateQueries(getTask.cacheKey(parentTaskId));
      client.invalidateQueries(
        getRelatedTasks.cacheKey(parentTaskId, relationType)
      );
    },
  });
  const handleIsDoneChange = async () => {
    try {
      const updatedTask = {
        ...task,
        isDone: !task.isDone,
      };
      await editTask.mutateAsync(updatedTask);
    } catch (error) {
      setErrorMessage(
        "Something went wrong :C, It's not possible to uncheck the task."
      );
    }
  };

  return (
    <Container>
      <p tw="font-bold text-base">{task.title}</p>
      <p tw="place-self-end">
        <Checkbox checked={task.isDone} onChange={handleIsDoneChange} />
      </p>
      {errorMessage && (
        <p tw="flex items-center text-orange-500 pt-1">&nbsp;{errorMessage}</p>
      )}
    </Container>
  );
}
