import {
  IRelatedTasksFlow,
  getRelatedTasksFlow,
} from "../../api/taskRelations";
import tw, { styled } from "twin.macro";

import { ITask } from "../../types/task";
import { useQuery } from "react-query";

interface Props {
  task: ITask;
}

const Container = styled.div(tw`text-gray-50 w-full space-y-2`);

export default function RelationGraph({ task }: Props) {
  const { data, isLoading, error } = useQuery(
    getRelatedTasksFlow.cacheKey(task.id),
    () => getRelatedTasksFlow.run(task.id)
  );

  if (isLoading) return <Container>Loading</Container>;
  if (error) return <Container>Oops</Container>;
  if (!data?.data) return <Container />;

  const relatedTasks: IRelatedTasksFlow[] = data.data;

  return (
    <>
      <div>RelationGraph {task.title}</div>
      <div>
        ------
        {relatedTasks.map((taskObj) => (
          <h2 key={taskObj.taskVertex.id}>{taskObj.taskVertex.title}</h2>
        ))}
        --------
      </div>
    </>
  );
}
