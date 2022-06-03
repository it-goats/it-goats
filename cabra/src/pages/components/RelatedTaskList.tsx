import "twin.macro";

import { DirectedRelationType } from "../../types/taskRelation";
import RelatedTask from "./RelatedTask";
import { getRelatedTasks } from "../../api/taskRelations";
import { routeHelpers } from "../../routes";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  if (isLoading) return <div>Loading</div>;
  if (error || !data?.data) return <div>Oops</div>;

  const relatedTasks = data.data;

  if (relatedTasks.length === 0) {
    return <div>{"<No tasks>"}</div>;
  }

  return (
    <div className={className}>
      {relatedTasks.map(({ relationId, task }) => (
        <RelatedTask
          key={relationId}
          task={task}
          relationType={relationType}
          parentTaskId={parentTaskId}
          onClick={(taskId: string) => {
            navigate(routeHelpers.task.details(taskId));
          }}
        />
      ))}
    </div>
  );
}
