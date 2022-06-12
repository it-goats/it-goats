import tw, { styled } from "twin.macro";

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

  const randomDOMElementKey = function (id: string) {
    return `unique_key_${id}_${Math.random()}`;
  };

  return (
    <>
      <div>RelationGraph</div>
      <div>
        -----------------------------------------------------------------
        {relatedTasks.map(({ taskVertex: tv, adjacencyList: adjList }) => (
          <div key={randomDOMElementKey(tv.id)}>
            <li key={tv.id}>{tv.title}</li>
            Related tasks:
            <h2 key={randomDOMElementKey(tv.id)}>
              {adjList &&
                adjList.map(({ task: t, relationType: r }) => {
                  return (
                    <h3 key={randomDOMElementKey(tv.id)}>
                      {t.title} - {r}
                    </h3>
                  );
                })}
            </h2>
          </div>
        ))}
        -----------------------------------------------------------------
      </div>
    </>
  );
}
