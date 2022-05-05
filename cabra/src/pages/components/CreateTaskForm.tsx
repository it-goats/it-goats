import { createTask, getTasks } from "../../api/tasks";
import { useMutation, useQueryClient } from "react-query";

import { ITask } from "../../types/task";
import TaskForm from "./TaskForm";
import { routeHelpers } from "../../routes";
import { useNavigate } from "react-router-dom";

const emptyTask: Omit<ITask, "id" | "isBlocked"> = {
  description: "",
  dueDate: null,
  title: "",
  isDone: false,
  tags: [],
};

export default function CreateTaskForm() {
  const navigate = useNavigate();
  const client = useQueryClient();
  const addTask = useMutation(createTask, {
    onSuccess: () => {
      client.invalidateQueries(getTasks.cacheKey());
      navigate(routeHelpers.tasks);
    },
  });

  return <TaskForm onSubmit={addTask.mutateAsync} task={emptyTask} />;
}
