import {
  ArrowCircleDownIcon,
  ArrowCircleUpIcon,
  CollectionIcon,
  DuplicateIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/solid";
import tw, { styled } from "twin.macro";

import { DirectedRelationType } from "../../types/taskRelation";
import ReactTooltip from "react-tooltip";

interface Props {
  type: DirectedRelationType;
}

const Icon = styled.div`
  ${tw`text-black bg-gray-300 p-0.5`}
`;

export function TaskTypeIcon({ type }: Props) {
  let icon;
  let message: string = type;
  switch (type) {
    case DirectedRelationType.Subtask:
      icon = <DuplicateIcon height={20} width={20} data-tip data-for={type} />;
      message = "Subtask";
      break;
    case DirectedRelationType.Supertask:
      icon = <CollectionIcon height={20} width={20} data-tip data-for={type} />;
      message = "Have subtask";
      break;
    case DirectedRelationType.Blocks:
      icon = (
        <ArrowCircleDownIcon height={20} width={20} data-tip data-for={type} />
      );
      message = "Blocks task";
      break;
    case DirectedRelationType.IsBlockedBy:
      icon = (
        <ArrowCircleUpIcon height={20} width={20} data-tip data-for={type} />
      );
      message = "Is blocked by task";
      break;
    case DirectedRelationType.Interchangable:
      icon = (
        <SwitchHorizontalIcon height={20} width={20} data-tip data-for={type} />
      );
      message = "Interchangeable task";
      break;
    default:
      return <div></div>;
  }
  return (
    <Icon>
      {icon}
      <ReactTooltip id={type} place="bottom" effect="solid">
        {message}
      </ReactTooltip>
    </Icon>
  );
}
