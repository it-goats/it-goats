import { ITask, TaskStatus } from "../../types/task";
import { createTask, getTasks } from "../../api/tasks";
import { useMutation, useQueryClient } from "react-query";

import TaskForm from "./TaskForm";
import { useNavigate } from "react-router-dom";

const emptyTask: Omit<ITask, "id"> = {
  description: "",
  dueDate: null,
  title: "",
  status: TaskStatus.TODO,
  tags: [],
};

export default function CreateTaskForm() {
  const navigate = useNavigate();
  const client = useQueryClient();
  const addTask = useMutation(createTask, {
    onSuccess: () => {
      client.invalidateQueries(getTasks.cacheKey());
      navigate(-1);
    },
  });

  return <TaskForm onSubmit={addTask.mutateAsync} task={emptyTask} />;
}
