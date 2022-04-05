import "twin.macro";

import { ArrowLeftIcon, PencilAltIcon } from "@heroicons/react/solid";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ITask } from "../types/task";
import Layout from "./components/Layout";
import NavigationButton from "./components/NavigationButton";
import Task from "./components/Task";
import axios from "axios";
import { routeHelpers } from "../routes";
import { useQuery } from "react-query";

export default function TaskDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };
  const { data, isLoading } = useQuery(
    ["task", id],
    () => axios.get<ITask>(`/tasks/${id}`),
    {
      onError: () => navigate(routeHelpers.notFound, { replace: true }),
      retry: 1,
    }
  );

  if (isLoading || !data) return <Layout>Loading</Layout>;

  return (
    <Layout>
      <div tw="w-[90%] max-w-xl space-y-6 relative z-10">
        <Task task={data.data} detailsLink={false}></Task>

        <div tw="flex justify-end w-full gap-4">
          <NavigationButton
            tw="text-warmGray-50 bg-blue-800"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon height={20} width={20} /> Go Back
          </NavigationButton>
          <Link to={routeHelpers.task.edit(id)}>
            <NavigationButton
              tw="text-warmGray-50 bg-lime-700"
              onClick={() => navigate(-1)}
            >
              <PencilAltIcon height={20} width={20} /> Edit
            </NavigationButton>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
