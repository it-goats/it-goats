import "twin.macro";

import NavigationButton from "./NavigationButton";
import { TrashIcon } from "@heroicons/react/solid";

interface Props {
  title: string;
}

export default function MiniTaskDelete({ title }: Props) {
  return (
    <div tw="rounded-xl w-full bg-white shadow-2xl text-blue-800  p-1.5">
      <p tw="flex items-center font-size[small]">
        {title}
        <NavigationButton
          tw="text-stone-50 bg-red-500 flex ml-auto"
          onClick={() => NaN}
        >
          <TrashIcon height={10} width={10} />
        </NavigationButton>
      </p>
    </div>
  );
}
