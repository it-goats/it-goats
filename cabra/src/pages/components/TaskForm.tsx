import * as yup from "yup";

import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import {
  DATE_TIME_FORMAT,
  TIME_FORMAT,
  getTimezone,
  parseUTC,
} from "../../utils/dates";
import tw, { styled } from "twin.macro";
import { useContext, useEffect } from "react";

import DatePicker from "react-datepicker";
import { ITask } from "../../types/task";
import NotificationForm from "./NotificationForm";
import { SettingsContext } from "./SettingsContext";
import SubtasksListEdit from "./SubtasksListEdit";
import { TagsEdit } from "./TagsEdit";
import TaskRelationsEdit from "./TaskRelationsEdit";
import { yupResolver } from "@hookform/resolvers/yup";
import { zonedTimeToUtc } from "date-fns-tz";

type Props = {
  onSubmit: (inputs: TaskFormInputs) => Promise<unknown>;
  task: Omit<ITask, "id" | "relationTypes" | "isBlocked"> & { id?: string };
};
export type TaskFormInputs = {
  title: string;
  description: string;
  dueDate: Date | null;
  notifyBeforeMinutes: number | null;
  rrule: string | null;
  relatedTasks: Array<{
    relationType: string;
    task: ITask;
  }>;
  subtasks: Array<{
    title: string;
    id: string | null;
  }>;
  tags: string[];
};

const schema = yup.object({
  title: yup.string().required("Your task's title is needed!").max(80),
  description: yup.string().max(1024),
  dueDate: yup.date().nullable(),
  relatedTasks: yup.array().of(
    yup.object({
      relationType: yup.string(),
      task: yup.object({ id: yup.string() }),
    })
  ),
  subtasks: yup.array().of(
    yup.object({
      title: yup.string().required("Subtask's title is needed!").max(80),
      id: yup.string().nullable(),
    })
  ),
  tags: yup.array().of(yup.string()),
});

const fieldStyles = tw`w-full px-4 py-2 rounded-lg shadow-2xl bg-tertiary text-black placeholder:text-primary/60`;

const Form = styled.form`
  ${tw`flex flex-col w-full`}

  .react-datepicker-wrapper {
    ${tw` text-blue-800 placeholder:text-blue-800/60`}

    input[type="text"] {
      max-width: 100%;
      ${tw`bg-tertiary rounded-lg shadow-2xl text-black`}
    }
  }
`;
const Label = styled.label(tw`text-gray-50 font-bold`);
const SubmitButton = styled.button(
  tw`bg-green-500 mt-4 py-2 text-white font-semibold`,
  tw`rounded shadow-2xl transition-transform transform hover:scale-[102%] disabled:opacity-50`
);

export default function TaskForm({ task, onSubmit }: Props) {
  const form = useForm<TaskFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...task,
      dueDate: parseUTC(task.dueDate),
      tags: task.tags.map(({ name }) => name),
      relatedTasks: [],
      subtasks: [],
    },
  });

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    watch,
  } = form;

  const { email } = useContext(SettingsContext);

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
      setError("title", { message: "Something went wrong :C " + error });
    }
  };

  const dueDate = watch("dueDate");

  useEffect(() => {
    if (!dueDate) {
      setValue("notifyBeforeMinutes", null);
      setValue("rrule", null);
    }
  }, [dueDate, setValue]);

  return (
    <FormProvider {...form}>
      <Form onSubmit={handleSubmit(internalOnSubmit)}>
        <fieldset tw="space-y-2">
          <div tw="space-y-2">
            <Label htmlFor="task-title">Name:</Label>
            <input
              css={[tw`form-input`, fieldStyles]}
              id="task-title"
              type="text"
              maxLength={80}
              placeholder="My new task"
              required
              {...register("title")}
            />
          </div>
          <div tw="space-y-2">
            <Label htmlFor="task-description">Description:</Label>
            <textarea
              css={[tw`form-textarea text-sm`, fieldStyles]}
              id="task-description"
              maxLength={1024}
              placeholder="My new task details"
              rows={6}
              {...register("description")}
            ></textarea>
          </div>
          <div tw="space-y-2">
            <Label htmlFor="title">Due date:</Label>
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
          <div>
            {dueDate && email && (
              <Controller
                control={control}
                name="notifyBeforeMinutes"
                render={({ field: { onChange, value } }) => (
                  <NotificationForm onChange={onChange} value={value} />
                )}
              />
            )}
          </div>
          {/* <div>
            {dueDate && (
              <Controller
                control={control}
                name="rrule"
                render={({ field: { onChange, value } }) => (
                  <RecurrenceForm onChange={onChange} value={value} />
                )}
              />
            )}
          </div> */}
        </fieldset>
        <TagsEdit />
        <TaskRelationsEdit taskId={task.id} />
        <SubtasksListEdit parentTaskId={task.id} />
        <SubmitButton type="submit" disabled={isSubmitting}>
          Submit!
        </SubmitButton>
        <div tw="text-red-500 pt-1 mb-6">&nbsp;{errors.title?.message}</div>
      </Form>
    </FormProvider>
  );
}
