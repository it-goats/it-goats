import { createTask, getTasks } from "../../api/tasks";
import { useMutation, useQueryClient } from "react-query";

import { ITask } from "../../types/task";
import TaskForm from "./TaskForm";

const emptyTask: Omit<ITask, "id"> = {
  description: "",
  dueDate: null,
  title: "",
  isDone: false,
};

export default function CreateTaskForm() {
  const client = useQueryClient();
  const addTask = useMutation(createTask, {
    onSuccess: () => client.invalidateQueries(getTasks.cacheKey),
  });

  return <TaskForm onSubmit={addTask.mutateAsync} task={emptyTask} />;
}
