import { ITask, TaskStatus } from "../../types/task";
import { createTask, getTasks } from "../../api/tasks";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";

import TaskForm from "./TaskForm";

const emptyTask: Omit<ITask, "id" | "relationTypes" | "isBlocked"> = {
  description: "",
  dueDate: null,
  rrule: null,
  status: TaskStatus.TODO,
  tags: [],
  title: "",
};

export default function CreateTaskForm() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const client = useQueryClient();
  const addTask = useMutation(createTask, {
    onSuccess: () => {
      client.invalidateQueries(getTasks.cacheKey());
      navigate(-1);
    },
  });

  return (
    <TaskForm
      onSubmit={addTask.mutateAsync}
      task={{
        ...emptyTask,
        dueDate: params.get("date"),
      }}
    />
  );
}
