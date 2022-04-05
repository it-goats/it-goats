import "twin.macro";

import TaskForm, { TaskFormInputs } from "./components/TaskForm";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router";

import { ArrowLeftIcon } from "@heroicons/react/solid";
import { ITask } from "../types/task";
import Layout from "./components/Layout";
import NavigationButton from "./components/NavigationButton";
import axios from "axios";
import { routeHelpers } from "../routes";

export default function TaskEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const client = useQueryClient();
  const { data, isLoading } = useQuery(
    ["task", id],
    () => axios.get<ITask>(`/tasks/${id}`),
    {
      onError: () => navigate(routeHelpers.notFound, { replace: true }),
      retry: 1,
    }
  );

  const addTask = useMutation((task: TaskFormInputs) =>
    axios.put<ITask>(`/tasks/${id}`, task)
  );

  const onSubmit = (variables: TaskFormInputs) =>
    addTask.mutateAsync(variables, {
      onSuccess: () => {
        client.invalidateQueries("tasks");
        client.invalidateQueries(["tasks", id]);
        navigate(-1);
      },
    });

  if (isLoading || !data) return <Layout>Loading</Layout>;
  return (
    <Layout>
      <div tw="w-[90%] max-w-xl">
        <div tw="flex justify-between items-end mb-4">
          <h1 tw="text-2xl text-warmGray-50 font-bold ">Edit task</h1>
          <NavigationButton
            tw="text-warmGray-50 bg-blue-800"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon height={20} width={20} />
            Go Back
          </NavigationButton>
        </div>

        <TaskForm task={data.data} onSubmit={onSubmit} />
      </div>
    </Layout>
  );
}
