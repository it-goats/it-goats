import tw, { styled } from "twin.macro";

import { DirectedRelationType } from "../../types/taskRelation";
import { ITask } from "../../types/task";
import RelationListEdit from "./RelationListEdit";
import Select from "react-select";
import { getTasks } from "../../api/tasks";
import { useQuery } from "react-query";
import { useState } from "react";

const Label = styled.label(tw`text-gray-50 font-bold`);
const CenteredLabel = styled.div(tw`text-gray-50 font-bold text-center`);
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
  const [tasksRelation, setTaskRelation] = useState<DirectedRelationType>(
    DEFAULT_RELATION_TYPE
  );
  const [relatedTasks, setRelatedTasks] = useState<ITask[]>([]);
  const [showSelected, setShowSelected] = useState(false);

  const { data, isLoading, error } = useQuery(getTasks.cacheKey, getTasks.run);

  if (isLoading) return <Container>Loading</Container>;
  if (error || !data?.data) return <Container>Oops</Container>;

  const formattedTasks: TaskOption[] = data.data
    .filter(({ isDone, id }) => !isDone && id != taskId)
    .map((task) => ({ value: task, label: task.title }));

  const toggleShowSelected = () => {
    setShowSelected(!showSelected);
  };

  return (
    <>
      <div>
        <CenteredLabel>Task Relations:</CenteredLabel>
      </div>
      <div tw="flex justify-evenly self-stretch object-fill">
        <Select
          onChange={(selected) => {
            selected
              ? setTaskRelation(selected.value)
              : setTaskRelation(DEFAULT_RELATION_TYPE);
          }}
          options={relationshipOptions}
          defaultValue={relationshipOptions[0]}
        />
        <Select
          onChange={(selected) => {
            setRelatedTasks(selected.map(({ value }) => value));
            setShowSelected(true);
          }}
          isMulti
          options={formattedTasks}
          key={`unique_select_key__${showSelected}`}
        />
      </div>
      <Label>
        {relatedTasks.length > 0 && showSelected && "selected tasks:"}
        {showSelected &&
          relatedTasks.map(({ id, title }) => <li key={id}>{title}</li>)}
      </Label>
      <RelationListEdit
        parentId={taskId}
        relationType={tasksRelation}
        relatedTasks={relatedTasks}
        parentCallback={toggleShowSelected}
      />
    </>
  );
}
