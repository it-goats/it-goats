import { CreateTaskApiInput, createTask, getTasks } from "../../api/tasks";
import { ITask, TaskStatus } from "../../types/task";
import TaskForm, { TaskFormInputs } from "./TaskForm";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";

const emptyTask: Omit<ITask, "id" | "relationTypes" | "isBlocked"> = {
  description: "",
  dueDate: null,
  notifyBeforeMinutes: null,
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

  const onSubmit = ({ relatedTasks, ...inputs }: TaskFormInputs) => {
    const variables: CreateTaskApiInput = {
      ...inputs,
      relations: relatedTasks.map(({ relationType, task }) => ({
        taskId: task.id,
        type: relationType,
      })),
      subtasks: inputs.subtasks.map(({ title }) => title),
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
