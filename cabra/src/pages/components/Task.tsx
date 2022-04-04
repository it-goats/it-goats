import "twin.macro";

import { ITask } from "../../types/task";
import { Link } from "react-router-dom";

interface Props {
  task: ITask;
  detailsLink: boolean;
}

export default function Task({ task, detailsLink }: Props) {
  return (
    <div tw="rounded-xl w-full bg-white shadow-2xl text-blue-800 text-xl p-4 md:text-2xl flex justify-between items-center">
      {task.title}
      {detailsLink ? (
        <Link
          tw="underline text-blue-600 text-lg hover:text-purple-800"
          to={`/task/${task.id}` }
          state={{ task }}
        >
          Details
        </Link>
      ) : null}
    </div>
  );
}
