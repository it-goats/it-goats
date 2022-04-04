import "twin.macro";

import { ITask } from "../types/task";
import { formatDateTime } from "../utils/dates";

interface Props {
  task: ITask;
}

export default function Task({ task }: Props) {
  return (
    <div tw="rounded-xl w-full bg-white shadow-2xl p-4 text-blue-800">
      <p tw="text-xl md:text-2xl">{task.title}</p>
      <p>{formatDateTime(task.dueDate)}</p>
    </div>
  );
}
