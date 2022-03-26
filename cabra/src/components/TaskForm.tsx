import * as yup from "yup";

import { SubmitHandler, useForm } from "react-hook-form";
import tw, { styled } from "twin.macro";
import { useMutation, useQueryClient } from "react-query";

import { ITask } from "../types/task";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";

type TaskInputs = Pick<ITask, "title">;

const schema = yup.object({
  title: yup.string().required("Your task's name is needed!").max(80),
});

const SubmitButton = styled.button(
  tw`bg-gradient-to-r from-green-400 to-cyan-500 px-4 text-white font-semibold`,
  tw`rounded shadow-2xl transition-transform transform hover:( scale-105) disabled:opacity-50`
);

export default function TaskForm() {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<TaskInputs>({
    resolver: yupResolver(schema),
  });

  const addTask = useMutation((task: TaskInputs) =>
    axios.post<ITask>("/tasks", task)
  );
  const client = useQueryClient();

  const onSubmit: SubmitHandler<TaskInputs> = async (data) => {
    try {
      await addTask.mutateAsync(data, {
        onSuccess: () => {
          client.invalidateQueries("tasks");
        },
      });
      reset();
    } catch (error) {
      setError("title", { message: "Something went wrong :C" });
    }
  };

  return (
    <form tw="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div tw="flex space-x-4 w-full">
        <input
          tw="form-input flex-1 px-4 py-2 rounded shadow-2xl text-lg text-blue-800 placeholder:text-blue-800/60"
          placeholder="Your next task... "
          {...register("title", { maxLength: 80, required: true })}
        />
        <SubmitButton type="submit" disabled={isSubmitting}>
          Add!
        </SubmitButton>
      </div>
      <div tw="text-orange-500 pt-1">&nbsp;{errors.title?.message}</div>
    </form>
  );
}
