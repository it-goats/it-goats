import "twin.macro";

import TaskForm, { TaskFormInputs } from "./components/TaskForm";
import { getTask, getTasks, updateTask } from "../api/tasks";
import tw, { styled } from "twin.macro";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeftIcon } from "@heroicons/react/solid";
import Layout from "./components/Layout";
import NavigationButton from "./components/NavigationButton";
import SubtasksListEdit from "./components/SubtasksListEdit";
import { TagsEdit } from "./components/TagsEdit";
import { routeHelpers } from "../routes";

const Label = styled.label(tw`text-gray-50 font-bold`);

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
      <div tw="w-[90%] max-w-2xl p-4 bg-primary rounded-xl">
        <div tw="flex justify-between items-end mb-4">
          <h1 tw="text-2xl text-stone-50 font-bold ">Edit task</h1>
          <NavigationButton
            tw="text-stone-50 bg-secondary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon height={20} width={20} />
            Go Back
          </NavigationButton>
        </div>
        <TaskForm task={data.data} onSubmit={editTask.mutateAsync} />
        <div tw="grid gap-4">
          <div tw="w-full">
            <Label>Tags:</Label>
            <TagsEdit tags={data.data.tags} taskId={id} />
            <Label>Subtasks:</Label>
            <SubtasksListEdit parentId={id} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
