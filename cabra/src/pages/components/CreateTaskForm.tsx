import TaskForm, { TaskFormInputs } from "./TaskForm";
import { useMutation, useQueryClient } from "react-query";

import { ITask } from "../../types/task";
import axios from "axios";

const emptyTask: Omit<ITask, "id"> = {
  description: "",
  dueDate: null,
  title: "",
};

export default function CreateTaskForm() {
  const addTask = useMutation((task: TaskFormInputs) =>
    axios.post<ITask>("/tasks", task)
  );
  const client = useQueryClient();

  const onSubmit = (variables: TaskFormInputs) =>
    addTask.mutateAsync(variables, {
      onSuccess: () => {
        client.invalidateQueries("tasks");
      },
    });

  return <TaskForm onSubmit={onSubmit} task={emptyTask} />;
}
