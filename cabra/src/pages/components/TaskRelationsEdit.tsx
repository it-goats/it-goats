import tw, { styled } from "twin.macro";

import { DirectedRelationType } from "../../types/taskRelation";
import { ITask } from "../../types/task";
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

// export enum DirectedRelationType {
//   IsDependentOn = "is_dependent_on",
//   DependsOn = "depends_on",
//   Subtask = "subtask",
//   Supertask = "supertask",
//   Interchangable = "interchangable",
// }

// interface Relationship {
//   readonly relationType: DirectedRelationType;
//   readonly parentTaskId: string;
// }

const relationshipOptions: RelationshipOption[] = [
  { value: DirectedRelationType.Subtask, label: "Subtask" },
  { value: DirectedRelationType.DependsOn, label: "Depends on" },
  { value: DirectedRelationType.IsDependentOn, label: "Is dependent on" },
  { value: DirectedRelationType.Interchangable, label: "Interchangeable" },
];

const sample_relationship = {
  value: DirectedRelationType.DependsOn,
  label: "Depends on",
};

export default function TaskRelationsEdit({ taskId }: Props) {
  const [value, setValue] = useState<DirectedRelationType>();

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
        <Label>TasksRelationsEdit</Label>
      </div>
      <div>
        <Select
          onChange={(selected) => setValue(selected?.value)}
          options={relationshipOptions}
          value={relationshipOptions.find(
            ({ label }) => label === sample_relationship.label
          )}
        />
        <Select
          // defaultValue={[colourOptions[2], colourOptions[3]]}
          // onChange={(selected) => }
          isMulti
          name="colors"
          options={formattedTasks}
          className="basic-multi-select"
          classNamePrefix="select"
        />
        <Label>
          {taskId}: {value}
        </Label>
      </div>
    </>
  );
}
