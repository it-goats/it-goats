import "twin.macro";

import NavigationButton from "./NavigationButton";
import { TrashIcon } from "@heroicons/react/solid";

interface Props {
  title: string;
  taskId: string;
  onClickDelete: (taskId: string) => void;
}

export default function MiniTaskDelete({
  title,
  onClickDelete,
  taskId,
}: Props) {
  return (
    <div tw="rounded-xl w-full bg-tertiary shadow-2xl text-black  p-1.5">
      <p tw="flex items-center text-sm">
        {title}
        <NavigationButton
          tw="text-stone-50 bg-red-500 flex ml-auto"
          onClick={() => onClickDelete(taskId)}
        >
          <TrashIcon height={10} width={10} />
        </NavigationButton>
      </p>
    </div>
  );
}
