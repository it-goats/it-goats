import tw, { styled } from "twin.macro";

import { DirectedRelationType } from "../../types/taskRelation";
import { ITask } from "../../types/task";
import RelationListEdit from "./RelationListEdit";
import Select from "react-select";
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
  { value: DirectedRelationType.Subtask, label: "Subtask" },
  { value: DirectedRelationType.DependsOn, label: "Depends on" },
  { value: DirectedRelationType.IsDependentOn, label: "Is dependent on" },
  { value: DirectedRelationType.Interchangable, label: "Interchangeable" },
];

const DEFAULT_RELATION_TYPE = DirectedRelationType.Subtask;

export default function TaskRelationsEdit({ taskId }: Props) {
  const [tasksRelation, setTaskRelation] = useState<DirectedRelationType>();
  const [relatedTasks, setRelatedTasks] = useState<ITask[]>([]);
  const [showSelected, setShowSelected] = useState(false);

  const { data, isLoading, error } = useQuery(getTasks.cacheKey, getTasks.run);

  if (isLoading) return <Container>Loading</Container>;
  if (error || !data?.data) return <Container>Oops</Container>;

  const formattedTasks: TaskOption[] = data.data
    .filter((task) => !task.isDone && task.id != taskId)
    .map((task) => ({ value: task, label: task.title }));

  const toggleShowSelected = function () {
    setShowSelected(!showSelected);
  };

  return (
    <>
      <div>
        <div tw="text-gray-50 font-bold mb-3">Add related tasks:</div>
      </div>
      <div tw="flex space-x-5 justify-evenly self-stretch object-fill mb-3">
        <Select
          onChange={(selected) => {
            setTaskRelation(selected?.value);
          }}
          options={relationshipOptions}
          defaultValue={relationshipOptions[0]}
          tw="flex-1"
        />
        <Select
          onChange={(selected) => {
            setRelatedTasks(selected.map((opt) => opt.value));
            setShowSelected(true);
          }}
          isMulti
          options={formattedTasks}
          key={`unique_select_key__${showSelected}`}
          tw="flex-1"
        />
      </div>
      <RelationListEdit
        parentId={taskId}
        relationType={tasksRelation || DEFAULT_RELATION_TYPE}
        relatedTasks={relatedTasks}
        parentCallback={toggleShowSelected}
      />
    </>
  );
}
