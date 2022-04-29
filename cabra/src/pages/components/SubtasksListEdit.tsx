import { DirectedRelationType, ITaskRelation } from "../../types/taskRelation";
import { FormEvent, useState } from "react";
import tw, { styled } from "twin.macro";
import { useMutation, useQuery } from "react-query";

import { ITask } from "../../types/task";
import MiniTaskDelete from "./MiniTaskDelete";
import { createTask } from "../../api/tasks";
import { getRelatedTasks } from "../../api/taskRelations";
import useTaskRelations from "../hooks/useTaskRelations";

const Container = styled.div(tw`text-gray-50 w-full space-y-4`);
const fieldStyles = tw`w-full px-4 py-2 rounded-xl text-blue-800 placeholder:text-blue-800/60 font-size[small]`;
const AddDependenceButton = styled.button(
  tw`rounded-lg flex flex-row items-start h-5 py-1 px-4 w-16 bg-tertiary font-bold text-lg color[#787DAB]`
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
  const relationType = DirectedRelationType.Subtask;
  const { addRelation, removeTask } = useTaskRelations({
    parentId,
    relationType,
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

  const handleClickDeleteRelation = () => {
    // eslint-disable-next-line no-console
    console.log("Mockup function");
  };

  const { data, isLoading, error } = useQuery(
    getRelatedTasks.cacheKey(parentId, DirectedRelationType.Subtask),
    () => getRelatedTasks.run(parentId, DirectedRelationType.Subtask)
  );

  if (isLoading) return <Container>Loading</Container>;
  if (error) return <Container>Oops</Container>;
  if (!data?.data) return <Container />;

  const subtasks = data.data.slice().reverse();

  return (
    <div>
      <Container>
        {subtasks.map((relatedTask) => (
          <MiniTaskDelete
            key={relatedTask.relationId}
            title={relatedTask.task.title}
            onClickDeleteTask={removeTask.mutateAsync}
            onClickRemoveRelation={handleClickDeleteRelation}
            taskId={relatedTask.task.id}
            relationType={relationType}
          />
        ))}
      </Container>
      <form onSubmit={handleSubmitSubtask}>
        <div tw="rounded-xl w-full text-blue-800  p-1.5">
          <p tw="flex items-center">
            <input
              css={[tw`form-input`, fieldStyles]}
              id="subtask"
              type="text"
              value={val}
              maxLength={80}
              required
              onChange={(event) => setVal(event.target.value)}
            />
          </p>
          <p tw="flex items-center">
            <AddDependenceButton type="submit">+add</AddDependenceButton>
          </p>
        </div>
      </form>
    </div>
  );
}
