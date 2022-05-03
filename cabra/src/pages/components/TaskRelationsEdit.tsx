import tw, { styled } from "twin.macro";

import { DirectedRelationType } from "../../types/taskRelation";
import { ITask } from "../../types/task";
import RelationListEdit from "./RelationListEdit";
import Select from "react-select";
import { getRelatedTasks } from "../../api/taskRelations";
import { getTasks } from "../../api/tasks";
import { useQuery } from "react-query";
import { useState } from "react";

const Container = styled.div(tw`text-gray-50 w-full space-y-4`);

interface Props {
  readonly taskId: string;
}

interface RelationshipOption {
  readonly value: DirectedRelationType;
  readonly label: string;
}

interface TaskOption {
  value: ITask;
  label: string;
}

const relationshipOptions: RelationshipOption[] = [
  { value: DirectedRelationType.IsBlockedBy, label: "Is blocked by" },
  { value: DirectedRelationType.Blocks, label: "Blocks" },
  { value: DirectedRelationType.Interchangable, label: "Interchangeable" },
];

const DEFAULT_RELATION_TYPE = DirectedRelationType.IsBlockedBy;

export default function TaskRelationsEdit({ taskId }: Props) {
  const [tasksRelation, setTaskRelation] = useState<DirectedRelationType>(
    DEFAULT_RELATION_TYPE
  );
  const [relatedTasks, setRelatedTasks] = useState<ITask[]>([]);
  const [showSelected, setShowSelected] = useState(false);

  const { data: dataSubtasks } = useQuery(
    getRelatedTasks.cacheKey(taskId, DirectedRelationType.Subtask),
    () => getRelatedTasks.run(taskId, DirectedRelationType.Subtask)
  );
  const { data, isLoading, error } = useQuery(getTasks.cacheKey, getTasks.run);

  if (isLoading) return <Container>Loading</Container>;
  if (error || !data?.data) return <Container>Oops</Container>;

  const subtasks = dataSubtasks?.data;

  const potentialRelative = (isDone: boolean, id: string) => {
    return (
      !isDone &&
      id !== taskId &&
      !subtasks?.map(({ task: subtask }) => subtask.id).includes(id)
    );
  };

  const formattedRelativesToBe: TaskOption[] = data.data
    .filter(({ isDone, id }) => potentialRelative(isDone, id))
    .map((task) => ({ value: task, label: task.title }));

  const toggleShowSelected = () => {
    setShowSelected(!showSelected);
  };

  return (
    <>
      <div tw="text-gray-50 font-bold mb-3">Add related tasks:</div>
      <div tw="flex space-x-5 justify-evenly self-stretch object-fill mb-3">
        <Select
          onChange={(selected) => {
            selected
              ? setTaskRelation(selected.value)
              : setTaskRelation(DEFAULT_RELATION_TYPE);
          }}
          options={relationshipOptions}
          defaultValue={relationshipOptions[0]}
          tw="flex-1"
        />
        <Select
          onChange={(selected) => {
            setRelatedTasks(selected.map(({ value }) => value));
            setShowSelected(true);
          }}
          isMulti
          options={formattedRelativesToBe}
          key={`unique_select_key__${showSelected}`}
          tw="flex-1"
        />
      </div>
      <RelationListEdit
        parentId={taskId}
        relationType={tasksRelation}
        relatedTasks={relatedTasks}
        parentCallback={toggleShowSelected}
      />
    </>
  );
}
