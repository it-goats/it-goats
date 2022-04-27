import tw, { styled } from "twin.macro";

import { DirectedRelationType } from "../../types/taskRelation";
import RelatedTask from "./RelatedTask";
import { getRelatedTasks } from "../../api/taskRelations";
import { useQuery } from "react-query";

interface Props {
  parentTaskId: string;
}

const Container = styled.div(tw`flex flex-row`);

export default function SubtasksList({ parentTaskId }: Props) {
  const { data, isLoading, error } = useQuery(
    getRelatedTasks.cacheKey(parentTaskId, DirectedRelationType.Subtask),
    () => getRelatedTasks.run(parentTaskId, DirectedRelationType.Subtask)
  );

  if (isLoading) return <Container>Loading</Container>;
  if (error) return <Container>Oops</Container>;
  if (!data?.data) return <Container />;

  const subtasks = data.data.slice().reverse();

  if (subtasks.length == 0) {
    return <div>{"<No tasks>"}</div>;
  }

  return (
    <Container>
      {subtasks.map((relatedTask) => (
        <RelatedTask
          key={relatedTask.relationId}
          task={relatedTask.task}
          relationType={DirectedRelationType.Subtask}
          parentTaskId={parentTaskId}
        />
      ))}
    </Container>
  );
}
