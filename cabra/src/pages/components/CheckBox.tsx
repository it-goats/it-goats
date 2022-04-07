import { ITask } from "../../types/task";
import tw from "twin.macro";
import { updateTask } from "../../api/tasks";

const CheckBoxStyle = tw`ml-auto flex items-center gap-2 p-2 rounded checked:bg-blue-500 checked:border-blue-500`;

const changeFlagIsDone = (task: ITask) => {
    task.isDone = ! task.isDone;
    updateTask(task.id, task);
};

const CheckBox = (task: ITask) => {
    return (
        <input type="checkbox" css={CheckBoxStyle} checked={task.isDone} onClick={() => changeFlagIsDone(task)}/>
    );
};

export default CheckBox;
