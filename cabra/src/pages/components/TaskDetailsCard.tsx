import { PencilIcon, TrashIcon } from "@heroicons/react/solid";

import CardField from "./CardField";
import CheckBox from "./CheckBox";
import { DirectedRelationType } from "../../types/taskRelation";
import { Link } from "react-router-dom";
import NavigationButton from "./NavigationButton";
import RelatedTasksList from "./RelatedTaskList";
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

const StatusCheckbox = styled(CheckBox)`
  ${tw`h-8 w-8`}
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
            <StatusCheckbox
              checked={task.isDone}
              onChange={handleStatusChange}
            />
            <Link to={routeHelpers.task.edit(task.id)}>
              <NavigationButton tw="text-amber-600 bg-amber-100">
                <PencilIcon height={16} width={16} />
              </NavigationButton>
            </Link>
            <NavigationButton
              tw="text-red-800 bg-red-500"
              onClick={() => removeTask()}
            >
              <TrashIcon height={16} width={16} />
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
          <RelatedTasksList
            relationType={DirectedRelationType.IsDependentOn}
            parentTaskId={id}
          />
        </CardField>
        <CardField title="Depends on" span={1}>
          <RelatedTasksList
            relationType={DirectedRelationType.DependsOn}
            parentTaskId={id}
          />
        </CardField>
        <CardField title="Interchangeable tasks" span={1}>
          <RelatedTasksList
            relationType={DirectedRelationType.Interchangable}
            parentTaskId={id}
          />
        </CardField>
      </Content>
    </div>
  );
}
