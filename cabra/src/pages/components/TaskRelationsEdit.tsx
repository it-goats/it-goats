import tw, { styled } from "twin.macro";

import { DirectedRelationType } from "../../types/taskRelation";
import { ITask } from "../../types/task";
import RelationListEdit from "./RelationListEdit";
import Select from "react-select";
import { getTasks } from "../../api/tasks";
import { useQuery } from "react-query";
import { useState } from "react";

const Label = styled.label(tw`text-gray-50 font-bold`);
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

const default_subtask = DirectedRelationType.Subtask;

export default function TaskRelationsEdit({ taskId }: Props) {
  const [tasksRelation, setTaskRelation] = useState<DirectedRelationType>();
  const [relatedTasks, setRelatedTasks] = useState<ITask[]>([]);

  const { data, isLoading, error } = useQuery(getTasks.cacheKey, getTasks.run);

  if (isLoading) return <Container>Loading</Container>;
  if (error || !data?.data) return <Container>Oops</Container>;

  const tasksPossible = data.data
    .slice()
    .filter((task) => !task.isDone && task.id != taskId);

  const formattedTasks: TaskOption[] = [];
  tasksPossible.forEach((task) => {
    formattedTasks.push({ value: task, label: task.title });
  });

  return (
    <>
      <div>
        <Label>Task Relations</Label>
      </div>
      <div tw="flex justify-evenly self-stretch object-fill">
        <Select
          onChange={(selected) => {
            setTaskRelation(selected?.value);
            if (selected?.value) {
              relationshipOptions.filter((option) => {
                option.value != selected?.value;
              });
            }
          }}
          options={relationshipOptions}
          value={relationshipOptions.find(({ label }) => {
            label === relationshipOptions[0].label;
          })}
        />
        <Select
          defaultValue={[formattedTasks[0]]}
          onChange={(selected) => {
            const arr: ITask[] = [];
            selected.forEach((opt) => {
              arr.push(opt.value);
            });
            setRelatedTasks(arr);
          }}
          isMulti
          name="colors"
          options={formattedTasks}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </div>
      <Label>
        {tasksRelation}
        {relatedTasks.map((v) => (
          <li key={v.id}>{v.title}</li>
        ))}
      </Label>
      <RelationListEdit
        parentId={taskId}
        relationType={tasksRelation || default_subtask}
        relatedTasks={relatedTasks}
      />
    </>
  );
}
