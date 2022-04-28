import { DirectedRelationType, ITaskRelation } from "../../types/taskRelation";
import { createRelation, getRelatedTasks } from "../../api/taskRelations";
import { deleteTask, getTask, getTasks } from "../../api/tasks";
import tw, { styled } from "twin.macro";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { ITask } from "../../types/task";
import MiniTaskDelete from "./MiniTaskDelete";
import { PlusIcon } from "@heroicons/react/solid";

const Container = styled.div(tw`text-gray-50 w-full space-y-2`);
const AddSubtaskButton = styled.button(
  tw`bg-secondary p-2 text-white font-semibold`,
  tw`rounded shadow-2xl flex gap-2 transition-transform transform hover:scale-105`
);

interface Props {
  parentId: string;
  relationType: DirectedRelationType;
  relatedTasks: ITask[];
}

export default function RelationListEdit({
  parentId,
  relationType,
  relatedTasks,
}: Props) {
  const client = useQueryClient();

  const addRelation = useMutation(createRelation, {
    onSuccess: () => {
      client.invalidateQueries(getTasks.cacheKey);
      client.invalidateQueries(getTask.cacheKey(parentId));
      client.invalidateQueries(
        getRelatedTasks.cacheKey(parentId, relationType)
      );
    },
  });

  const removeTask = useMutation(
    (relatedTaskId: string) => deleteTask(relatedTaskId),
    {
      onSuccess: () => {
        client.invalidateQueries(getTasks.cacheKey);
        client.invalidateQueries(getTask.cacheKey(parentId));
        client.invalidateQueries(
          getRelatedTasks.cacheKey(parentId, relationType)
        );
      },
    }
  );

  const handleAddClick = function () {
    let relationString: string;
    switch (relationType) {
      case DirectedRelationType.DependsOn.valueOf() ||
        DirectedRelationType.IsDependentOn.valueOf():
        relationString = "DEPENDENT";
        break;
      case DirectedRelationType.Interchangable:
        relationString = "INTERCHANGABLE";
        break;
      default:
        relationString = "SUBTASK";
        break;
    }

    relatedTasks.forEach((t) => {
      const relation: Omit<ITaskRelation, "id"> = {
        firstTaskId: parentId,
        secondTaskId: t.id,
        type: relationString,
      };
      addRelation.mutateAsync(relation);
    });
  };

  const { data, isLoading, error } = useQuery(
    getRelatedTasks.cacheKey(parentId, relationType),
    () => getRelatedTasks.run(parentId, relationType)
  );

  if (isLoading) return <Container>Loading</Container>;
  if (error) return <Container>Oops</Container>;
  if (!data?.data) return <Container />;

  const allRelatedTasks = data.data.slice().reverse();

  return (
    <div>
      <AddSubtaskButton onClick={handleAddClick}>
        <PlusIcon width={24} height={24} /> Submit
      </AddSubtaskButton>
      <Container>
        {allRelatedTasks.map((relatedTask) => (
          <MiniTaskDelete
            key={relatedTask.relationId}
            title={relatedTask.task.title}
            onClickDelete={removeTask.mutateAsync}
            taskId={relatedTask.task.id}
          />
        ))}
      </Container>
    </div>
  );
}
