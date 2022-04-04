import "twin.macro";

import { useNavigate, useParams } from "react-router-dom";

import { ITask } from "../types/task";
import Layout from "./components/Layout";
import Task from "./components/Task";
import axios from "axios";
import { useQuery } from "react-query";

export default function TaskDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useQuery(
    ["task", id],
    () => axios.get<ITask>(`/tasks/${id}`),
    { onError: () => navigate("/not-found", { replace: true }), retry: 1 }
  );

  if (isLoading) return <Layout>Loading</Layout>;

  return (
    <Layout>
      <button tw="text-purple-800 font-black" onClick={() => navigate(-1)}>
        {"<"} go back
      </button>
      {data ? (
        <div tw="w-[90%] max-w-xl space-y-6 relative z-10">
          <Task task={data.data} detailsLink={false}></Task>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </Layout>
  );
}
