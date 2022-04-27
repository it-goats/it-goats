import { getTask, getTasks, updateTask } from "../../api/tasks";
import tw, { styled } from "twin.macro";
import { useMutation, useQuery, useQueryClient } from "react-query";

import Checkbox from "./CheckBox";
import { DirectedRelationType } from "../../types/taskRelation";
import { ITask } from "../../types/task";
import { getRelatedTasks } from "../../api/taskRelations";
import { useState } from "react";

interface RelatedTaskProps {
  task: ITask;
  relationType: DirectedRelationType;
  parentTaskId: string;
}

interface RelatedTasksListProps {
  relationType: DirectedRelationType;
  parentTaskId: string;
}

const Container = styled.div(tw``);

export const RelatedTask = ({
  task,
  relationType,
  parentTaskId,
}: RelatedTaskProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const client = useQueryClient();
  const editTask = useMutation((task: ITask) => updateTask(task.id, task), {
    onSuccess: () => {
      client.invalidateQueries(getTasks.cacheKey);
      client.invalidateQueries(getTask.cacheKey(parentTaskId));
      client.invalidateQueries(
        getRelatedTasks.cacheKey(parentTaskId, relationType)
      );
    },
  });
  const handleIsDoneChange = async () => {
    try {
      const updatedTask = {
        ...task,
        isDone: !task.isDone,
      };
      await editTask.mutateAsync(updatedTask);
    } catch (error) {
      setErrorMessage(
        "Something went wrong :C, It's not possible to uncheck the task."
      );
    }
  };

  return (
    <div tw="rounded-xl bg-tertiary text-secondary m-1.5 p-1.5 grid">
      <p tw="font-medium text-xs">{task.title}</p>
      <p tw="place-self-end">
        <Checkbox checked={task.isDone} onChange={handleIsDoneChange} />
      </p>
      {errorMessage && (
        <p tw="flex items-center text-orange-500 pt-1">&nbsp;{errorMessage}</p>
      )}
    </div>
  );
};

export default function RelatedTasksList({
  relationType,
  parentTaskId,
}: RelatedTasksListProps) {
  const { data, isLoading, error } = useQuery(
    getRelatedTasks.cacheKey(parentTaskId, relationType),
    () => getRelatedTasks.run(parentTaskId, relationType)
  );

  if (isLoading) return <Container>Loading</Container>;
  if (error) return <Container>Oops</Container>;
  if (!data?.data) return <Container />;

  const subtasks = data.data.slice().reverse();

  if (subtasks.length == 0) {
    return <Container>{"<No tasks>"}</Container>;
  }

  return (
    <Container>
      {subtasks.map((relatedTask) => (
        <RelatedTask
          key={relatedTask.relationId}
          task={relatedTask.task}
          relationType={relationType}
          parentTaskId={parentTaskId}
        />
      ))}
    </Container>
  );
}
