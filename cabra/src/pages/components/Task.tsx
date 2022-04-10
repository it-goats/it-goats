import "twin.macro";

import { getTask, getTasks, updateTask } from "../../api/tasks";
import { useMutation, useQueryClient } from "react-query";

import CheckBox from "./CheckBox";
import { ITask } from "../../types/task";
import { Link } from "react-router-dom";
import NavigationButton from "./NavigationButton";
import { formatDateTime } from "../../utils/dates";
import { routeHelpers } from "../../routes";
import { useState } from "react";

interface Props {
  task: ITask;
  detailsLink: boolean;
}

export default function Task({ task, detailsLink }: Props) {
  const [errorMessage, setErrorMessage] = useState("");
  const client = useQueryClient();
  const editTask = useMutation((task: ITask) => updateTask(task.id, task), {
    onSuccess: () => {
      client.invalidateQueries(getTasks.cacheKey);
      client.invalidateQueries(getTask.cacheKey(task.id));
    },
  });
  const handleIsDoneChange = async () => {
    try {
      const updatedTask = {
        ...task,
        isDone: !task.isDone,
      };
      await editTask.mutateAsync(updatedTask);
    } catch (error) {
      setErrorMessage(
        "Something went wrong :C, It's not possible to uncheck the task."
      );
    }
  };

  return (
    <div tw="rounded-xl w-full bg-white shadow-2xl text-blue-800  p-4">
      <p tw="flex items-center text-xl md:text-2xl">
        {task.title}
        <CheckBox checked={task.isDone} onChange={handleIsDoneChange} />
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
      {errorMessage && (
        <p tw="flex items-center text-orange-500 pt-1">&nbsp;{errorMessage}</p>
      )}
    </div>
  );
}
