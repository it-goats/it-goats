import { ITask, TaskStatus } from "../../types/task";
import {
  deleteTask,
  getTask,
  getTasks,
  updateTaskStatus,
} from "../../api/tasks";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { DirectedRelationType } from "../../types/taskRelation";
import { getRelatedTasks } from "../../api/taskRelations";
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
  const editTaskStatus = useMutation(
    (status: TaskStatus) => updateTaskStatus(task.id, status, task.instanceKey),
    {
      onSuccess: () => {
        client.invalidateQueries(getTasks.cacheKey());
        client.invalidateQueries(getTask.cacheKey(task?.id));
        client.invalidateQueries(
          getRelatedTasks.cacheKey(task?.id, DirectedRelationType.IsBlockedBy)
        );
        client.invalidateQueries(
          getRelatedTasks.cacheKey(
            task?.id,
            DirectedRelationType.Interchangable
          )
        );
        client.invalidateQueries(
          getRelatedTasks.cacheKey(task?.id, DirectedRelationType.Blocks)
        );
      },
    }
  );
  const handleStatusChange = async () => {
    const status =
      task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;
    editTaskStatus.mutate(status);
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
