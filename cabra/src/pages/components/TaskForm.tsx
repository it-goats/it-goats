import * as yup from "yup";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  DATE_TIME_FORMAT,
  TIME_FORMAT,
  getTimezone,
  parseUTC,
} from "../../utils/dates";
import tw, { styled } from "twin.macro";

import AddDependenceButton from "./AddDependenceButton";
import DatePicker from "react-datepicker";
import { ITask } from "../../types/task";
import { yupResolver } from "@hookform/resolvers/yup";
import { zonedTimeToUtc } from "date-fns-tz";

type Props = {
  onSubmit: (inputs: TaskFormInputs) => Promise<unknown>;
  task: Omit<ITask, "id">;
};
export type TaskFormInputs = Omit<ITask, "id" | "dueDate"> & {
  dueDate: Date | null;
};

const schema = yup.object({
  title: yup.string().required("Your task's name is needed!").max(80),
  description: yup.string().max(1024),
  dueDate: yup.date().nullable(),
});

const fieldStyles = tw`w-full px-4 py-2 rounded shadow-2xl text-blue-800 placeholder:text-blue-800/60`;

const Form = styled.form`
  ${tw`flex flex-col space-y-4 w-full`}

  .react-datepicker-wrapper {
    ${tw` text-blue-800 placeholder:text-blue-800/60`}

    input[type="text"] {
      max-width: 100%;
      ${tw`rounded shadow-2xl`}
    }
  }
`;
const Label = styled.label(tw`text-gray-50`);
const SubmitButton = styled.button(
  tw`bg-gradient-to-r from-green-400 to-cyan-500 py-2 text-white font-semibold`,
  tw`rounded shadow-2xl transition-transform transform hover:scale-105 disabled:opacity-50`
);

export default function TaskForm({ task, onSubmit }: Props) {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<TaskFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...task,
      dueDate: parseUTC(task.dueDate),
    },
  });

  const internalOnSubmit: SubmitHandler<TaskFormInputs> = async ({
    dueDate,
    ...data
  }) => {
    try {
      const inputs = {
        ...data,
        dueDate: dueDate && zonedTimeToUtc(dueDate, getTimezone()),
      };
      await onSubmit(inputs);

      reset();
    } catch (error) {
      setError("title", { message: "Something went wrong :C" });
    }
  };

  return (
    <Form onSubmit={handleSubmit(internalOnSubmit)}>
      <div tw="grid gap-4 grid-cols-1 sm:grid-cols-[1fr 200px]">
        <div tw="w-full">
          <Label htmlFor="task-title">Title</Label>
          <input
            css={[tw`form-input`, fieldStyles]}
            id="task-title"
            type="text"
            maxLength={80}
            placeholder="Your next task... "
            required
            {...register("title")}
          />
        </div>
        <div tw="w-full">
          <Label htmlFor="title">Due date</Label>
          <Controller
            control={control}
            name="dueDate"
            render={({ field: { onChange, onBlur, value } }) => (
              <DatePicker
                onChange={onChange}
                onBlur={onBlur}
                id="task-due-date"
                placeholderText="Due date"
                selected={value}
                showTimeSelect
                timeFormat={TIME_FORMAT}
                timeIntervals={15}
                timeCaption="time"
                dateFormat={DATE_TIME_FORMAT}
                calendarStartDay={1}
              />
            )}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="task-description">Description</Label>
        <textarea
          css={[tw`form-textarea text-sm`, fieldStyles]}
          id="task-description"
          maxLength={1024}
          placeholder="Some description..."
          rows={6}
          {...register("description")}
        ></textarea>
      </div>
      <div tw="grid gap-4 grid-cols-4">
        <div tw="w-full">
          <Label>subtasks:</Label>
          {/* lista subtasków i +add to dodanie pustego subtasku, gdzieś trzeba usuwać puste subtaski */}
          <AddDependenceButton onClick={() => NaN}>+add</AddDependenceButton>
        </div>
        <div tw="w-full">
          <Label>depends on:</Label>
          <AddDependenceButton onClick={() => NaN}>+add</AddDependenceButton>
        </div>
        <div tw="w-full">
          <Label>is dependant on:</Label>
          <AddDependenceButton onClick={() => NaN}>+add</AddDependenceButton>
        </div>
        <div tw="w-full">
          <Label>interchangable:</Label>
          <AddDependenceButton onClick={() => NaN}>+add</AddDependenceButton>
        </div>
      </div>
      <SubmitButton type="submit" disabled={isSubmitting}>
        Submit!
      </SubmitButton>
      <div tw="text-orange-500 pt-1">&nbsp;{errors.title?.message}</div>
    </Form>
  );
}
