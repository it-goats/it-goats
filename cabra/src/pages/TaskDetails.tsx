import "twin.macro";

import {
  ArrowLeftIcon,
  PencilAltIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteTask, getTask } from "../api/tasks";
import { useMutation, useQuery } from "react-query";

import Layout from "./components/Layout";
import NavigationButton from "./components/NavigationButton";
import Task from "./components/Task";
import { routeHelpers } from "../routes";

export default function TaskDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };
  const { data, isLoading } = useQuery(
    getTask.cacheKey(id),
    () => getTask.run(id),
    {
      onError: () => navigate(routeHelpers.notFound, { replace: true }),
      retry: 1,
    }
  );

  const removeTask = useMutation(() => deleteTask(id), {
    onSuccess: () => navigate(-1),
  });

  if (isLoading || !data) return <Layout>Loading</Layout>;

  return (
    <Layout>
      <div tw="w-[90%] max-w-xl space-y-6 relative z-10">
        <Task task={data.data} detailsLink={false}></Task>

        <div tw="flex justify-end w-full gap-4">
          <NavigationButton
            tw="text-stone-50 bg-blue-800"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon height={20} width={20} /> Go Back
          </NavigationButton>
          <Link to={routeHelpers.task.edit(id)}>
            <NavigationButton tw="text-stone-50 bg-lime-700">
              <PencilAltIcon height={20} width={20} /> Edit
            </NavigationButton>
          </Link>
          <NavigationButton
            tw="text-stone-50 bg-red-500"
            onClick={() => removeTask.mutateAsync()}
          >
            <TrashIcon height={20} width={20} /> Delete
          </NavigationButton>
        </div>
      </div>
    </Layout>
  );
}
