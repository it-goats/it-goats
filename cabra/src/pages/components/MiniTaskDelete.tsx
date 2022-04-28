import "twin.macro";

import { DirectedRelationType } from "../../types/taskRelation";
import NavigationButton from "./NavigationButton";
import { TrashIcon } from "@heroicons/react/solid";

interface Props {
  title: string;
  taskId: string;
  onClickDelete: (taskId: string) => void;
  relationType: DirectedRelationType;
}

export default function MiniTaskDelete({
  title,
  onClickDelete,
  taskId,
  relationType,
}: Props) {
  return (
    <div tw="rounded-xl w-full bg-tertiary shadow-2xl text-black  p-1.5">
      <div tw="flex items-center text-sm">
        <div tw="flex justify-around w-3/4">
          <div>{title}</div>
          <div tw="text-blue-800 font-medium">
            {relationType == DirectedRelationType.DependsOn && "depends on"}
            {relationType == DirectedRelationType.IsDependentOn &&
              "is dependent on"}
            {relationType == DirectedRelationType.Subtask && "subtask"}
            {relationType == DirectedRelationType.Interchangable &&
              "interchangeable"}
          </div>
        </div>
        <NavigationButton
          tw="text-stone-50 bg-red-500 flex ml-auto"
          onClick={() => onClickDelete(taskId)}
        >
          <TrashIcon height={10} width={10} />
        </NavigationButton>
      </div>
    </div>
  );
}
