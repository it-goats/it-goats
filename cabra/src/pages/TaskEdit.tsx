import "twin.macro";

import TaskForm, { TaskFormInputs } from "./components/TaskForm";
import { getTask, getTasks, updateTask } from "../api/tasks";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeftIcon } from "@heroicons/react/solid";
import Layout from "./components/Layout";
import NavigationButton from "./components/NavigationButton";
import { routeHelpers } from "../routes";

export default function TaskEditPage() {
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };
  const client = useQueryClient();
  const { data, isLoading } = useQuery(
    getTask.cacheKey(id),
    () => getTask.run(id),
    {
      onError: () => navigate(routeHelpers.notFound, { replace: true }),
      retry: 1,
    }
  );

  const editTask = useMutation((task: TaskFormInputs) => updateTask(id, task), {
    onSuccess: () => {
      client.invalidateQueries(getTasks.cacheKey);
      client.invalidateQueries(getTask.cacheKey(id));
      navigate(-1);
    },
  });

  if (isLoading || !data) return <Layout>Loading</Layout>;
  return (
    <Layout>
      <div tw="w-[90%] max-w-xl">
        <div tw="flex justify-between items-end mb-4">
          <h1 tw="text-2xl text-stone-50 font-bold ">Edit task</h1>
          <NavigationButton
            tw="text-stone-50 bg-blue-800"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon height={20} width={20} />
            Go Back
          </NavigationButton>
        </div>

        <TaskForm task={data.data} onSubmit={editTask.mutateAsync} />
      </div>
    </Layout>
  );
}
