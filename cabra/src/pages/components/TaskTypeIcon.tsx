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

const IconContainer = styled.div`
  ${tw`text-blue-700 bg-tertiary p-1 rounded`}
`;

export const EmptyIcon = styled.div`
  ${tw`bg-primary p-1 h-7 w-7 rounded`}
`;

const TYPES_TO_ICONS = {
  [DirectedRelationType.Subtask]: {
    Icon: DuplicateIcon,
    message: "Subtask",
  },
  [DirectedRelationType.Supertask]: {
    Icon: CollectionIcon,
    message: "Has subtask",
  },
  [DirectedRelationType.Blocks]: {
    Icon: ArrowCircleDownIcon,
    message: "Blocks another task",
  },
  [DirectedRelationType.IsBlockedBy]: {
    Icon: ArrowCircleUpIcon,
    message: "Is blocked by another task",
  },
  [DirectedRelationType.Interchangable]: {
    Icon: SwitchHorizontalIcon,
    message: "Interchangeable task",
  },
};

export function TaskTypeIcon({ type }: Props) {
  const { Icon, message } = TYPES_TO_ICONS[type];
  return (
    <IconContainer>
      <Icon height={20} width={20} data-tip data-for={type} />
      <ReactTooltip id={type} place="bottom" effect="solid">
        {message}
      </ReactTooltip>
    </IconContainer>
  );
}
