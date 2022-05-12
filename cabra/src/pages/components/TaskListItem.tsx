import { ITask, TaskStatus } from "../../types/task";
import { getTask, getTasks, updateTask } from "../../api/tasks";
import tw, { styled } from "twin.macro";
import { useMutation, useQueryClient } from "react-query";

import { ArrowRightIcon } from "@heroicons/react/solid";
import CheckBox from "./CheckBox";
import { Link } from "react-router-dom";
import NavigationButton from "./NavigationButton";
import { formatDateTime } from "../../utils/dates";
import { routeHelpers } from "../../routes";
import { useState } from "react";

interface Props {
  task: ITask;
}

const Card = styled.div(tw`p-2 w-full bg-secondary rounded-lg`);
const Column = styled.div(tw`flex flex-col gap-2`);
const TagChip = styled.div(tw`rounded-full px-2 bg-tertiary text-secondary`);

export default function TaskListItem({ task }: Props) {
  const [errorMessage, setErrorMessage] = useState("");
  const client = useQueryClient();
  const editTask = useMutation((task: ITask) => updateTask(task.id, task), {
    onSuccess: () => {
      client.invalidateQueries(getTask.cacheKey(task.id));
      client.invalidateQueries(getTasks.cacheKey());
    },
  });
  const handleIsDoneChange = async () => {
    const newStatus =
      task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;
    try {
      const updatedTask = {
        ...task,
        status: newStatus,
      };
      await editTask.mutateAsync(updatedTask);
    } catch (error) {
      setErrorMessage(
        "Something went wrong :C, It's not possible to uncheck the task."
      );
    }
  };

  return (
    <div tw="rounded-xl w-full bg-primary text-stone-50 shadow-2xl p-4 grid grid-cols-[1fr 30%] gap-x-4">
      <Column>
        <Card tw="text-lg font-bold py-4">{task.title}</Card>
        <Card tw="text-sm flex gap-y-1 gap-x-2">
          Tags:
          {task.tags.length > 0
            ? task.tags.map((tag) => <TagChip key={tag.id}>{tag.name}</TagChip>)
            : " No tags found"}
        </Card>
      </Column>
      <Column>
        {task.dueDate && (
          <Card tw="flex justify-center font-bold">
            {formatDateTime(task.dueDate)}
          </Card>
        )}
        <div>
          <Card tw="flex justify-center items-center gap-4">
            <CheckBox
              checked={task.status !== TaskStatus.TODO}
              id={`task-${task.id}`}
              onChange={handleIsDoneChange}
              disabled={task.isBlocked}
              size="sm"
            />
            <Link to={routeHelpers.task.details(task.id)} state={{ task }}>
              <NavigationButton tw="text-primary bg-tertiary rounded p-1 text-sm">
                More <ArrowRightIcon width={20} height={20} />
              </NavigationButton>
            </Link>
          </Card>
        </div>
      </Column>
      {errorMessage && (
        <p tw="flex items-center text-orange-500 pt-1">&nbsp;{errorMessage}</p>
      )}
    </div>
  );
}
