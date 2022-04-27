import "twin.macro";

import { DirectedRelationType } from "../../types/taskRelation";
import RelatedTask from "./RelatedTask";
import { getRelatedTasks } from "../../api/taskRelations";
import { useQuery } from "react-query";

interface Props {
  relationType: DirectedRelationType;
  parentTaskId: string;
  className?: string;
}

export default function RelatedTasksList({
  relationType,
  parentTaskId,
  className,
}: Props) {
  const { data, isLoading, error } = useQuery(
    getRelatedTasks.cacheKey(parentTaskId, relationType),
    () => getRelatedTasks.run(parentTaskId, relationType)
  );

  if (isLoading) return <div>Loading</div>;
  if (error) return <div>Oops</div>;
  if (!data?.data) return <div />;

  const subtasks = data.data.slice().reverse();

  if (subtasks.length == 0) {
    return <div>{"<No tasks>"}</div>;
  }

  return (
    <div className={className}>
      {subtasks.map((relatedTask) => (
        <RelatedTask
          key={relatedTask.relationId}
          task={relatedTask.task}
          relationType={relationType}
          parentTaskId={parentTaskId}
        />
      ))}
    </div>
  );
}
