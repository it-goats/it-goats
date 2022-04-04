import tw, { styled } from "twin.macro";
import { useNavigate, useParams } from "react-router-dom";

import { ITask } from "../types/task";
import Task from "./components/Task";
import axios from "axios";
import { useQuery } from "react-query";

const Container = styled.div`
  ${tw`flex flex-col items-center h-screen py-10 overflow-auto max-h-screen`}
  ${tw`bg-gradient-to-b from-blue-700 to-fuchsia-500`}
`;

export default function TaskDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useQuery(
    ["task", id],
    () => axios.get<ITask>(`/tasks/${id}`),
    { onError: () => navigate("/not-found", { replace: true }), retry: 1 }
  );

  if (isLoading) return <Container>Loading</Container>;

  return (
    <>
      <Container>
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
      </Container>
    </>
  );
}
