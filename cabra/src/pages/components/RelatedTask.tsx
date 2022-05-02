import "twin.macro";

import { ITask, TaskStatus } from "../../types/task";
import { getTask, getTasks, updateTask } from "../../api/tasks";
import { useMutation, useQueryClient } from "react-query";

import Checkbox from "./CheckBox";
import { DirectedRelationType } from "../../types/taskRelation";
import { getRelatedTasks } from "../../api/taskRelations";
import { useState } from "react";

interface Props {
  task: ITask;
  relationType: DirectedRelationType;
  parentTaskId: string;
  onClick?: (taskId: string) => void;
}

export default function RelatedTask({
  task,
  relationType,
  parentTaskId,
  onClick,
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
        status:
          task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE,
      };
      await editTask.mutateAsync(updatedTask);
    } catch (error) {
      setErrorMessage(
        "Something went wrong :C, It's not possible to uncheck the task."
      );
    }
  };

  return (
    <div
      onClick={() => onClick?.(task.id)}
      tw="rounded-xl bg-tertiary text-secondary m-1.5 p-1.5 grid cursor-pointer hover:opacity-80"
    >
      <p tw="font-bold text-base">{task.title}</p>
      <p tw="place-self-end">
        <Checkbox
          id={task.id}
          checked={task.status !== TaskStatus.TODO}
          onChange={handleIsDoneChange}
        />
      </p>
      {errorMessage && (
        <p tw="flex items-center text-orange-500 pt-1">&nbsp;{errorMessage}</p>
      )}
    </div>
  );
}
