import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import tw, { styled } from "twin.macro";
import { useEffect, useState } from "react";

import { DirectedRelationType } from "../../types/taskRelation";
import { TaskFormInputs } from "./TaskForm";
import { getRelatedTasks } from "../../api/taskRelations";
import { useFormContext } from "react-hook-form";
import { useQuery } from "react-query";

const Container = styled.div(tw`text-gray-50 w-full space-y-4`);
const Label = styled.label(tw`text-gray-50 font-bold`);

interface Props {
  parentTaskId?: string;
}

export default function SubtasksListEdit({ parentTaskId }: Props) {
  const form = useFormContext<TaskFormInputs>();
  const [inputValue, setInputValue] = useState("");
  const { setValue } = form;

  const subtasksQuery = useQuery(
    parentTaskId
      ? getRelatedTasks.cacheKey(parentTaskId, DirectedRelationType.Subtask)
      : [],
    () =>
      parentTaskId
        ? getRelatedTasks.run(parentTaskId, DirectedRelationType.Subtask)
        : null,
    { enabled: !!parentTaskId }
  );

  useEffect(() => {
    const subtasks =
      subtasksQuery?.data?.data?.map(({ task: { id, title } }) => ({
        title,
        id,
      })) ?? [];

    setValue("subtasks", subtasks);
  }, [subtasksQuery?.data?.data, setValue]);

  const subtasks = form.watch("subtasks");

  return (
    <div>
      <Label>Subtasks:</Label>
      <Container>
        <div tw="grid gap-x-2 grid-cols-[1fr 2rem]">
          <input
            id="subtask-title"
            type="text"
            tw="w-full px-4 py-2 rounded-lg shadow-2xl bg-tertiary text-black placeholder:text-primary/60"
            maxLength={80}
            placeholder="New subtask name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            tw="bg-success p-2 rounded flex items-center text-white transition-transform transform hover:scale-105 disabled:(opacity-50 scale-100)"
            disabled={inputValue === ""}
            onClick={() => {
              setValue("subtasks", [
                { title: inputValue, id: null },
                ...subtasks,
              ]);
              setInputValue("");
            }}
            type="button"
          >
            <PlusIcon width={20} height={20} />
          </button>
        </div>
      </Container>
      <div tw="flex flex-col space-y-2 my-1 text-black mt-4">
        {subtasks?.map(({ title }, index) => (
          <div
            key={index}
            tw="grid grid-cols-[1fr 2rem] gap-x-2 items-center font-normal"
          >
            <p tw="w-full px-4 py-2 rounded-lg bg-tertiary text-black">
              {title}
            </p>
            <button
              tw="bg-red-500 p-2 rounded flex items-center text-white transition-transform transform hover:scale-105 disabled:(opacity-50 scale-100)"
              onClick={() =>
                setValue(
                  "subtasks",
                  subtasks.filter((_, idx) => idx !== index)
                )
              }
              type="button"
            >
              <TrashIcon width={20} height={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
