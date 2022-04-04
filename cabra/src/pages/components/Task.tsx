import "twin.macro";

import { ITask } from "../../types/task";
import { Link } from "react-router-dom";
import { formatDateTime } from "../../utils/dates";

interface Props {
  task: ITask;
  detailsLink: boolean;
}

export default function Task({ task, detailsLink }: Props) {
  return (
    <div tw="rounded-xl w-full bg-white shadow-2xl text-blue-800  p-4">
      <p tw="text-xl md:text-2xl">{task.title}</p>
      <p tw="flex items-center">
        {formatDateTime(task.dueDate)}
        {detailsLink && (
          <Link
            tw="ml-auto underline text-blue-600 text-lg hover:text-purple-800"
            to={`/task/${task.id}`}
            state={{ task }}
          >
            Details
          </Link>
        )}
      </p>
    </div>
  );
}
