import { DirectedRelationType, ITaskRelation } from "../../types/taskRelation";
import tw, { styled } from "twin.macro";

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
    let relationString: string;
    switch (relationType) {
      case DirectedRelationType.DependsOn:
      case DirectedRelationType.IsDependentOn:
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
      let relation: Omit<ITaskRelation, "id">;
      if (relationType === DirectedRelationType.IsDependentOn) {
        relation = {
          firstTaskId: t.id,
          secondTaskId: parentId,
          type: relationString,
        };
      } else {
        relation = {
          firstTaskId: parentId,
          secondTaskId: t.id,
          type: relationString,
        };
      }
      addRelation.mutateAsync(relation);
    });
    parentCallback();
  };

  function resolveRelationLabel(relationType: DirectedRelationType): string {
    switch (relationType) {
      case DirectedRelationType.DependsOn:
        return "Depends on";
      case DirectedRelationType.IsDependentOn:
        return "Is dependent on";
      case DirectedRelationType.Subtask:
        return "Subtask";
      default:
        return "Interchangable";
    }
  }

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
      <Label>{resolveRelationLabel(relationType)}</Label>
      <Container>
        <div tw="text-center">
          {allRelatedTasks.length === 0 &&
            "No task related as " + resolveRelationLabel(relationType)}
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
