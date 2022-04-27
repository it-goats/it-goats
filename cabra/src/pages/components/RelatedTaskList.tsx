import tw, { styled } from "twin.macro";

import { DirectedRelationType } from "../../types/taskRelation";
import RelatedTask from "./RelatedTask";
import { getRelatedTasks } from "../../api/taskRelations";
import { useQuery } from "react-query";

interface RelatedTasksListProps {
  relationType: DirectedRelationType;
  parentTaskId: string;
}

const Container = styled.div(tw``);

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
