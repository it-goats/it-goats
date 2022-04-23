import "twin.macro";

import CheckBox from "./CheckBox";
import { ITask } from "../../types/task";
import { Link } from "react-router-dom";
import NavigationButton from "./NavigationButton";
import { formatDateTime } from "../../utils/dates";
import { routeHelpers } from "../../routes";
import useTask from "../hooks/useTask.hook";

interface Props {
  task: ITask;
  detailsLink: boolean;
}

export default function Task({ task, detailsLink }: Props) {
  const { handleStatusChange, error } = useTask(task);

  return (
    <div tw="rounded-xl w-full bg-white shadow-2xl text-blue-800  p-4">
      <p tw="flex items-center text-xl md:text-2xl">
        {task.title}
        {<CheckBox checked={task.isDone} onChange={handleStatusChange} />}
      </p>
      <p tw="flex items-center">
        {formatDateTime(task.dueDate)}
        {detailsLink && (
          <Link
            tw="ml-auto"
            to={routeHelpers.task.details(task.id)}
            state={{ task }}
          >
            <NavigationButton>Details</NavigationButton>
          </Link>
        )}
      </p>
      {error && (
        <p tw="flex items-center text-orange-500 pt-1">&nbsp;{error}</p>
      )}
    </div>
  );
}
