import { ITask, TaskStatus } from "../../types/task";
import { PlusIcon, TrashIcon } from "@heroicons/react/solid";
import Select, { CSSObjectWithLabel } from "react-select";
import tw, { styled } from "twin.macro";
import { useEffect, useState } from "react";

import { DirectedRelationType } from "../../types/taskRelation";
import { TaskFormInputs } from "./TaskForm";
import { getRelatedTasks } from "../../api/taskRelations";
import { getTasks } from "../../api/tasks";
import { useFormContext } from "react-hook-form";
import { useQuery } from "react-query";

interface Props {
  readonly taskId?: string;
}

interface RelationOption {
  readonly value: DirectedRelationType;
  readonly label: string;
}

const resolveRelationTypeLabel = (type: string) => {
  switch (type) {
    case DirectedRelationType.IsBlockedBy:
      return "Is blocked by";
    case DirectedRelationType.Blocks:
      return "Blocks";
    default:
      return "Interchangeable";
  }
};
const relationOptions: RelationOption[] = [
  DirectedRelationType.IsBlockedBy,
  DirectedRelationType.Blocks,
  DirectedRelationType.Interchangable,
].map((type) => ({ value: type, label: resolveRelationTypeLabel(type) }));

const Container = styled.div(tw`text-gray-50 w-full space-y-4`);
const selectStyles = {
  option: (provided: CSSObjectWithLabel) => ({
    ...provided,
    color: "black",
    fontWeight: "normal",
    padding: 8,
  }),
  control: (provided: CSSObjectWithLabel) => ({
    ...provided,
    borderRadius: "8px",
    fontWeight: "normal",
    backgroundColor: "#beccef",
  }),
};

export default function TaskRelationsEdit({ taskId }: Props) {
  const form = useFormContext<TaskFormInputs>();
  const { setValue } = form;
  const [selectedRelationOption, setSelectedRelationOption] =
    useState<RelationOption>(relationOptions[0]);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  const relatedTasksQuery = useQuery(
    taskId ? getRelatedTasks.cacheKey(taskId) : [],
    () => (taskId ? getRelatedTasks.run(taskId) : null),
    { enabled: !!taskId }
  );
  const allTodoTasksQuery = useQuery(
    getTasks.cacheKey({ status: TaskStatus.TODO }),
    () => getTasks.run({ status: TaskStatus.TODO })
  );

  useEffect(() => {
    const relatedTasks =
      relatedTasksQuery?.data?.data?.map(({ relationType, task }) => ({
        relationType,
        task,
      })) ?? [];

    setValue("relatedTasks", relatedTasks);
  }, [relatedTasksQuery?.data?.data, setValue]);

  const relatedTasks = relatedTasksQuery?.data?.data ?? [];
  const allTodoTasks = allTodoTasksQuery?.data?.data ?? [];

  if (relatedTasksQuery?.isLoading || allTodoTasksQuery?.isLoading)
    return <Container>Loading</Container>;
  if (relatedTasksQuery?.isError || allTodoTasksQuery?.isError)
    return <Container>Oops</Container>;

  const formRelatedTasks = form.watch("relatedTasks");
  const availableTasks = allTodoTasks.filter(
    (todoTask) =>
      todoTask.id !== taskId &&
      ![...relatedTasks, ...formRelatedTasks].some(
        (relatedTask) =>
          relatedTask.task.id === todoTask.id &&
          relatedTask.relationType === selectedRelationOption.value
      )
  );

  return (
    <div tw="text-gray-50 font-bold mb-3">
      <p>Related tasks:</p>
      <div tw="grid grid-cols-[12rem 1fr 2rem] gap-x-2">
        <Select
          isClearable={false}
          isSearchable={false}
          onChange={(selectedOption) =>
            selectedOption && setSelectedRelationOption(selectedOption)
          }
          options={relationOptions}
          styles={selectStyles}
          value={selectedRelationOption}
        />
        <Select
          formatOptionLabel={(task) => task.title}
          onChange={setSelectedTask}
          options={availableTasks}
          styles={selectStyles}
          isOptionSelected={(option) => option?.id === selectedTask?.id}
          value={selectedTask}
        />
        <button
          tw="bg-success p-2 rounded flex items-center text-white transition-transform transform hover:scale-105 disabled:(opacity-50 scale-100)"
          disabled={!selectedTask}
          onClick={() => {
            if (selectedTask) {
              setValue("relatedTasks", [
                ...formRelatedTasks,
                {
                  relationType: selectedRelationOption.value,
                  task: selectedTask,
                },
              ]);
              setSelectedTask(null);
            }
          }}
          type="button"
        >
          <PlusIcon width={20} height={20} />
        </button>
      </div>
      <div tw="flex flex-col space-y-2 my-1 text-black mt-4">
        {formRelatedTasks.map(({ relationType, task }) => (
          <div
            key={task.id}
            tw="grid grid-cols-[1fr 2rem] gap-x-2 py-0 items-center font-normal"
          >
            <p tw="bg-white p-2 rounded-lg bg-tertiary flex gap-x-2">
              <span tw="w-max bg-secondary py-0.5 px-1 text-white rounded text-sm tracking-wide">
                {resolveRelationTypeLabel(relationType)}
              </span>
              <span>{task.title}</span>
            </p>
            <button
              type="button"
              tw="bg-red-500 p-2 rounded flex items-center text-white transition-transform transform hover:scale-105 disabled:(opacity-50 scale-100)"
              onClick={() =>
                setValue(
                  "relatedTasks",
                  formRelatedTasks.filter(
                    (element) => element.task.id !== task.id
                  )
                )
              }
            >
              <TrashIcon width={20} height={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
