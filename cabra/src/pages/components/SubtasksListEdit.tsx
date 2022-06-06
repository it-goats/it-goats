import tw, { styled } from "twin.macro";

import { DirectedRelationType } from "../../types/taskRelation";
import { TaskFormInputs } from "./TaskForm";
import { getRelatedTasks } from "../../api/taskRelations";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "react-query";

const Container = styled.div(tw`text-gray-50 w-full space-y-4`);
const Label = styled.label(tw`text-gray-50 font-bold`);

interface Props {
  parentTaskId: string;
}

export default function SubtasksListEdit({ parentTaskId }: Props) {
  const form = useFormContext<TaskFormInputs>();
  const { setValue } = form;
  
  const subtasksQuery = useQuery(
    parentTaskId ? getRelatedTasks.cacheKey(parentTaskId, DirectedRelationType.Subtask) : [],
    () => (parentTaskId ? getRelatedTasks.run(parentTaskId, DirectedRelationType.Subtask) : null),
    { enabled: !!parentTaskId }
  );

  useEffect(() => {
    const subtasks =
      subtasksQuery?.data?.data?.map(({ task }) => ({
        "subtaskTitle": task.title,
        "subtaskId": task.id,
      })) ?? [];

    setValue("subtasks", subtasks);
  }, [subtasksQuery?.data?.data, setValue]);

  const subtasks = subtasksQuery?.data?.data ?? [];

  return (
    <div>
      <Label>Subtasks:</Label>
      <Container>
        {subtasks.forEach(subtask => subtask.task.title)}
      </Container>
    </div>
  );
}
