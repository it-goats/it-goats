import "twin.macro";

import { DirectedRelationType } from "../../types/taskRelation";
import NavigationButton from "./NavigationButton";
import { TrashIcon } from "@heroicons/react/solid";

interface Props {
  title: string;
  taskId: string;
  onClickDeleteTask?: (taskId: string) => void;
  onClickRemoveRelation?: (taskId: string) => void;
  relationType: DirectedRelationType;
}

export default function MiniTaskDelete({
  title,
  onClickDeleteTask,
  onClickRemoveRelation,
  taskId,
  relationType,
}: Props) {
  const handleClick = () => {
    if (relationType === DirectedRelationType.Subtask) {
      return onClickDeleteTask?.(taskId);
    }
    return onClickRemoveRelation?.(taskId);
  };

  return (
    <div tw="rounded-xl w-full bg-tertiary shadow-2xl text-black  p-1.5">
      <div tw="flex items-center text-sm">
        <div tw="w-3/4">
          <div>{title}</div>
        </div>
        <NavigationButton
          tw="text-stone-50 bg-red-500 flex ml-auto"
          onClick={handleClick}
        >
          <TrashIcon height={10} width={10} />
        </NavigationButton>
      </div>
    </div>
  );
}
