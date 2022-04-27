import { PencilIcon, TrashIcon } from "@heroicons/react/solid";

import CardField from "./CardField";
import CheckBox from "./CheckBox";
import { Link } from "react-router-dom";
import NavigationButton from "./NavigationButton";
import SubtasksList from "./SubtasksList";
import { formatDateTime } from "../../utils/dates";
import { routeHelpers } from "../../routes";
import styled from "@emotion/styled";
import tw from "twin.macro";
import useTaskDetails from "../hooks/useTaskDetails";

const Content = styled.div`
  ${tw`grid grid-cols-3 gap-4 min-h-full`}
  ${tw`text-white`}
  grid-template-rows: repeat(3, max-content) minmax(0, 1fr);
`;

const ColumnFields = styled.div`
  ${tw`flex flex-col gap-4`}
`;

const Ctas = styled(CardField)`
  ${tw`flex place-content-around`}
`;

interface Props {
  id: string;
}

export default function TaskDetails({ id }: Props) {
  const { handleStatusChange, task, removeTask, isLoading } =
    useTaskDetails(id);

  if (isLoading) return <>Loading</>;

  return (
    <div tw="rounded-xl w-full bg-primary shadow-2xl text-blue-800 p-4 h-full">
      <Content>
        <CardField span={2} title="Title">
          {task.title}
        </CardField>
        <ColumnFields>
          <CardField title="Deadline" align="center">
            {task?.dueDate ? formatDateTime(task.dueDate) : "<No deadline>"}
          </CardField>
          <Ctas align="center">
            <CheckBox
              checked={task.isDone}
              id={`task-${task.id}`}
              onChange={handleStatusChange}
            />
            <Link to={routeHelpers.task.edit(task.id)}>
              <NavigationButton tw="text-amber-600 bg-amber-100">
                <PencilIcon height={20} width={20} />
              </NavigationButton>
            </Link>
            <NavigationButton
              tw="text-red-800 bg-red-500"
              onClick={() => removeTask()}
            >
              <TrashIcon height={20} width={20} />
            </NavigationButton>
          </Ctas>
        </ColumnFields>
        <CardField title="Description" span={3}>
          {task.description || "<No description>"}
        </CardField>
        <CardField title="Subtasks" span={3}>
          <SubtasksList parentId={id} />
        </CardField>
        <CardField title="Is dependent on" span={1}>
          {"<No tasks>"}
        </CardField>
        <CardField title="Depends on" span={1}>
          {"<No tasks>"}
        </CardField>
        <CardField title="Interchangeable tasks" span={1}>
          {"<No tasks>"}
        </CardField>
      </Content>
    </div>
  );
}
