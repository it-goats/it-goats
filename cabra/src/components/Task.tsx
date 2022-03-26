import "twin.macro";

import { ITask } from "../types/task";

interface Props {
  task: ITask;
}

export default function Task({ task }: Props) {
  return (
    <div tw="rounded-xl w-full bg-white shadow-2xl text-blue-800 text-xl p-4 md:text-2xl">
      {task.title}
    </div>
  );
}
