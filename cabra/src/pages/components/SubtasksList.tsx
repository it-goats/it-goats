import tw, { styled } from "twin.macro";

import { DirectedRelationType } from "../../types/taskRelation";
import { RelatedTask } from "./RelatedTaskList";
import { getRelatedTasks } from "../../api/taskRelations";
import { useQuery } from "react-query";

// interface Props {
//   subtask: ITask;
//   parentId: string;
// }

interface PropsList {
  parentId: string;
}

const Container = styled.div(tw`flex flex-row`);

// const Subtask = ({ subtask, parentId }: Props) => {
//   const [errorMessage, setErrorMessage] = useState("");
//   const client = useQueryClient();
//   const editTask = useMutation((task: ITask) => updateTask(task.id, task), {
//     onSuccess: () => {
//       client.invalidateQueries(getTasks.cacheKey);
//       client.invalidateQueries(getTask.cacheKey(parentId));
//       client.invalidateQueries(getRelatedTasks.cacheKey(parentId, DirectedRelationType.Subtask));
//     },
//   });
//   const handleIsDoneChange = async () => {
//     try {
//       const updatedTask = {
//         ...subtask,
//         isDone: !subtask.isDone,
//       };
//       await editTask.mutateAsync(updatedTask);
//     } catch (error) {
//       setErrorMessage(
//         "Something went wrong :C, It's not possible to uncheck the task."
//       );
//     }
//   };

//   return (
//     <div tw="rounded-xl bg-tertiary text-secondary p-1.5 grid">
//       <p tw="font-medium text-xs">{subtask.title}</p>
//       <p tw="place-self-end">
//         <Checkbox checked={subtask.isDone} onChange={handleIsDoneChange} />
//       </p>
//       {errorMessage && (
//         <p tw="flex items-center text-orange-500 pt-1">&nbsp;{errorMessage}</p>
//       )}
//     </div>
//   );
// };

export default function SubtasksList({ parentId }: PropsList) {
  const { data, isLoading, error } = useQuery(
    getRelatedTasks.cacheKey(parentId, DirectedRelationType.Subtask),
    () => getRelatedTasks.run(parentId, DirectedRelationType.Subtask)
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
          relationType={DirectedRelationType.Subtask}
          parentTaskId={parentId}
        />
      ))}
    </Container>
  );
}
