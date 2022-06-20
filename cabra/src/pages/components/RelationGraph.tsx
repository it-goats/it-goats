import tw, { styled } from "twin.macro";

import FlowGraph from "./FlowGraph";
import { IRelatedTasksFlow } from "../../types/taskRelation";
import { ITask } from "../../types/task";
import { getRelatedTasksFlow } from "../../api/taskRelations";
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
      <FlowGraph task={task} tasksFlowGraph={relatedTasks} />
    </>
  );
}
