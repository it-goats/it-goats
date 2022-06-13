import { IRelatedTasksFlow } from "../../types/taskRelation";
import { ITask } from "../../types/task";
import { randomDOMElementKey } from "../../utils/helperFunctions";

interface Props {
  task: ITask;
  tasksFlowGraph: IRelatedTasksFlow[];
}

export default function FlowGraph({ task, tasksFlowGraph }: Props) {
  return (
    <>
      <div>FlowGraph</div>
      Task title: {task.title}
      {tasksFlowGraph.map((el) => (
        <h4 key={randomDOMElementKey(el.taskVertex.id)}>
          {el.taskVertex.title}
        </h4>
      ))}
    </>
  );
}
