import { ITask, TaskStatus } from "../../types/task";
import { deleteTask, getTask, getTasks, updateTask } from "../../api/tasks";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { routeHelpers } from "../../routes";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const useTask = (id: string) => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery(
    getTask.cacheKey(id),
    () => getTask.run(id),
    {
      onError: () => navigate(routeHelpers.notFound, { replace: true }),
      retry: 1,
    }
  );

  const task = data?.data as ITask;

  const [error, setError] = useState("");
  const client = useQueryClient();
  const editTask = useMutation((task: ITask) => updateTask(task.id, task), {
    onSuccess: () => {
      client.invalidateQueries(getTasks.cacheKey);
      client.invalidateQueries(getTask.cacheKey(task?.id));
    },
  });
  const handleStatusChange = async () => {
    const updatedTask = {
      ...task,
      status:
        task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE,
    };
    editTask.mutate(updatedTask);
  };

  const { mutateAsync: removeTask } = useMutation(() => deleteTask(task?.id), {
    onSuccess: () => navigate(-1),
    onMutate: () => setError(""),
    onError: () =>
      setError(
        "Something went wrong :C, It's not possible to uncheck the task."
      ),
  });

  return { handleStatusChange, error, task, isLoading, removeTask };
};

export default useTask;
