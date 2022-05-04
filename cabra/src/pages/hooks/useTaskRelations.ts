import {
  createRelation,
  deleteRelation,
  getRelatedTasks,
} from "../../api/taskRelations";
import { deleteTask, getTask, getTasks } from "../../api/tasks";
import { useMutation, useQueryClient } from "react-query";

import { DirectedRelationType } from "../../types/taskRelation";

interface useTaskRelationsProps {
  parentId: string;
  relationType: DirectedRelationType;
}

export default function useTaskRelations({
  parentId,
  relationType,
}: useTaskRelationsProps) {
  const client = useQueryClient();

  const addRelation = useMutation(createRelation, {
    onSuccess: () => {
      client.invalidateQueries(
        getRelatedTasks.cacheKey(parentId, relationType)
      );
    },
  });

  const removeRelation = useMutation(
    (relationId: string) => deleteRelation(relationId),
    {
      onSuccess: () => invalidateCommonQueries(),
    }
  );

  const removeTask = useMutation(
    (relatedTaskId: string) => deleteTask(relatedTaskId),
    {
      onSuccess: () => invalidateCommonQueries(),
    }
  );

  function invalidateCommonQueries() {
    client.invalidateQueries(getTasks.cacheKey());
    client.invalidateQueries(getTask.cacheKey(parentId));
    client.invalidateQueries(getRelatedTasks.cacheKey(parentId, relationType));
  }

  return { addRelation, removeRelation, removeTask };
}
