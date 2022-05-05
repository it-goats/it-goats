import tw, { styled } from "twin.macro";

import { DirectedRelationType } from "../../types/taskRelation";
import { ITask } from "../../types/task";
import MiniTaskDelete from "./MiniTaskDelete";
import { getRelatedTasks } from "../../api/taskRelations";
import { useQuery } from "react-query";
import useTaskRelations from "../hooks/useTaskRelations";

const Container = styled.div(tw`text-gray-50 w-full space-y-2`);
const Label = styled.div(tw`text-gray-50 font-bold`);
const AddSubtaskButton = styled.button(
  tw`bg-secondary p-2 text-white font-semibold`,
  tw`rounded shadow-2xl flex gap-2 transition-transform transform hover:scale-105`
);

interface Props {
  parentId: string;
  relationType: DirectedRelationType;
  relatedTasks: ITask[];
  parentCallback: () => void;
}

const relationLabel: Record<DirectedRelationType, string> = {
  [DirectedRelationType.Blocks]: "Blocks",
  [DirectedRelationType.Interchangable]: "Interchangeable",
  [DirectedRelationType.IsBlockedBy]: "Is blocked by",
  [DirectedRelationType.Subtask]: "Subtask",
  [DirectedRelationType.Supertask]: "Supertask",
};

const relationApiType: Record<DirectedRelationType, string> = {
  [DirectedRelationType.Blocks]: "DEPENDENT",
  [DirectedRelationType.Interchangable]: "INTERCHANGABLE",
  [DirectedRelationType.IsBlockedBy]: "DEPENDENT",
  [DirectedRelationType.Subtask]: "SUBTASK",
  [DirectedRelationType.Supertask]: "SUBTASK",
};

export default function RelationListEdit({
  parentId,
  relationType,
  relatedTasks,
  parentCallback,
}: Props) {
  const { addRelation, removeRelation, removeTask } = useTaskRelations({
    parentId,
    relationType,
  });

  const handleAddClick = function () {
    const type = relationApiType[relationType];

    relatedTasks.forEach((t) => {
      const tasksIds = [parentId, t.id];
      if (relationType === DirectedRelationType.Blocks) tasksIds.reverse();
      const [firstTaskId, secondTaskId] = tasksIds;

      addRelation.mutateAsync({
        type,
        firstTaskId,
        secondTaskId,
      });
    });
    parentCallback();
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
      <AddSubtaskButton onClick={handleAddClick} tw="mb-10">
        Submit
      </AddSubtaskButton>
      <Label>{relationLabel[relationType]}</Label>
      <Container>
        <div tw="text-center">
          {allRelatedTasks.length === 0 &&
            "No task related as " + relationLabel[relationType]}
        </div>
        {allRelatedTasks.map((relatedTask) => (
          <MiniTaskDelete
            key={relatedTask.relationId}
            title={relatedTask.task.title}
            onClickDeleteTask={removeTask.mutateAsync}
            onClickRemoveRelation={() =>
              removeRelation.mutateAsync(relatedTask.relationId)
            }
            taskId={relatedTask.task.id}
            relationType={relationType}
          />
        ))}
      </Container>
    </div>
  );
}
