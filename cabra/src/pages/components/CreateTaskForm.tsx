import { ITask, TaskStatus } from "../../types/task";
import { TaskApiInput, createTask, getTasks } from "../../api/tasks";
import TaskForm, { TaskFormInputs } from "./TaskForm";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";

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

  const onSubmit = (inputs: TaskFormInputs) => {
    const variables: TaskApiInput = {
      ...inputs,
      relatedTasks: inputs.relatedTasks.map(({ relationType, task }) => ({
        relationType,
        taskId: task.id,
      })),
    };

    return addTask.mutateAsync(variables);
  };

  return (
    <TaskForm
      onSubmit={onSubmit}
      task={{
        ...emptyTask,
        dueDate: params.get("date"),
      }}
    />
  );
}
