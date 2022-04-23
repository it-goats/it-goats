import { getTask, getTasks, updateTask } from "../../api/tasks";
import { useMutation, useQueryClient } from "react-query";

import { ITask } from "../../types/task";
import { useState } from "react";

const useTask = (task: ITask) => {
  const [error, setError] = useState("");
  const client = useQueryClient();
  const editTask = useMutation((task: ITask) => updateTask(task.id, task), {
    onSuccess: () => {
      client.invalidateQueries(getTasks.cacheKey);
      client.invalidateQueries(getTask.cacheKey(task.id));
    },
  });
  const handleStatusChange = async () => {
    try {
      const updatedTask = {
        ...task,
        isDone: !task.isDone,
      };
      await editTask.mutateAsync(updatedTask);
      setError("");
    } catch (err) {
      setError(
        "Something went wrong :C, It's not possible to uncheck the task."
      );
    }
  };

  return { handleStatusChange, error };
};

export default useTask;
