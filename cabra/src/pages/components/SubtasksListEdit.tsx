import { FormEvent, useState } from "react";
import { createRelation, getSubtasks } from "../../api/taskRelations";
import { createTask, deleteTask, getTask, getTasks } from "../../api/tasks";
import tw, { styled } from "twin.macro";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { ITask } from "../../types/task";
import { ITaskRelation } from "../../types/taskRelation";
import MiniTaskDelete from "./MiniTaskDelete";
import { PlusIcon } from "@heroicons/react/solid";

const Container = styled.div(tw`text-gray-50 w-full space-y-2`);
const AddSubtaskButton = styled.button(
  tw`bg-secondary p-2 text-white font-semibold`,
  tw`rounded shadow-2xl flex gap-2 transition-transform transform hover:scale-105`
);
const SubtaskInput = styled.input(
  tw`form-input w-full px-4 py-2 rounded-lg shadow-2xl bg-tertiary text-black placeholder:text-primary/60`
);

const emptyTask: Omit<ITask, "id"> = {
  description: "",
  dueDate: null,
  title: "",
  isDone: false,
  tags: [],
};

interface Props {
  parentId: string;
}

export default function SubtasksListEdit({ parentId }: Props) {
  const [val, setVal] = useState("");
  const client = useQueryClient();

  const addRelation = useMutation(createRelation, {
    onSuccess: () => {
      client.invalidateQueries(getTasks.cacheKey);
      client.invalidateQueries(getTask.cacheKey(parentId));
      client.invalidateQueries(getSubtasks.cacheKey(parentId));
    },
  });
  const addSubtask = useMutation(createTask, {
    onSuccess: (data) => {
      const relation: Omit<ITaskRelation, "id"> = {
        firstTaskId: parentId,
        secondTaskId: data.data.id,
        type: "SUBTASK",
      };
      addRelation.mutateAsync(relation);
    },
  });

  const handleSubmitSubtask = (event: FormEvent) => {
    event.preventDefault();
    setVal("");
    const inputs = {
      ...emptyTask,
      title: val,
    };
    addSubtask.mutateAsync(inputs);
  };

  const removeTask = useMutation((subtaskId: string) => deleteTask(subtaskId), {
    onSuccess: () => {
      client.invalidateQueries(getTasks.cacheKey);
      client.invalidateQueries(getTask.cacheKey(parentId));
      client.invalidateQueries(getSubtasks.cacheKey(parentId));
    },
  });

  const { data, isLoading, error } = useQuery(
    getSubtasks.cacheKey(parentId),
    () => getSubtasks.run(parentId)
  );

  if (isLoading) return <Container>Loading</Container>;
  if (error) return <Container>Oops</Container>;
  if (!data?.data) return <Container />;

  const subtasks = data.data.slice().reverse();

  return (
    <div>
      <form onSubmit={handleSubmitSubtask}>
        <div tw="w-full flex gap-4 mb-4">
          <SubtaskInput
            id="subtask"
            maxLength={80}
            onChange={(event) => setVal(event.target.value)}
            placeholder="Subtask name"
            required
            type="text"
            value={val}
          />
          <AddSubtaskButton type="submit">
            <PlusIcon width={24} height={24} /> Add
          </AddSubtaskButton>
        </div>
        <Container>
          {subtasks.map((relatedTask) => (
            <MiniTaskDelete
              key={relatedTask.relationId}
              title={relatedTask.task.title}
              onClickDelete={removeTask.mutateAsync}
              taskId={relatedTask.task.id}
            />
          ))}
        </Container>
      </form>
    </div>
  );
}
