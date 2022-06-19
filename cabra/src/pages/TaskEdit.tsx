import "twin.macro";

import { EditTaskApiInput, getTask, getTasks, updateTask } from "../api/tasks";
import TaskForm, { TaskFormInputs } from "./components/TaskForm";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeftIcon } from "@heroicons/react/solid";
import { DirectedRelationType } from "../types/taskRelation";
import Layout from "./components/Layout";
import NavigationButton from "./components/NavigationButton";
import { getRelatedTasks } from "../api/taskRelations";
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

  const editTask = useMutation(
    (task: EditTaskApiInput) => updateTask(id, task),
    {
      onSuccess: () => {
        client.invalidateQueries(getTasks.cacheKey());
        client.invalidateQueries(getTask.cacheKey(id));
        navigate(-1);
      },
    }
  );

  const onSubmit = async ({
    subtasks: newSubtasks,
    relatedTasks: newRelatedTasks,
    tags: newTags,
    ...inputs
  }: TaskFormInputs) => {
    const ogTask = data?.data;
    if (!ogTask) return;

    // tags
    const ogTagsSet = new Set(ogTask.tags.map(({ name }) => name));
    const newTagsSet = new Set(newTags);
    const tagsToAdd = newTags.filter((tag) => !ogTagsSet.has(tag));
    const tagsToDelete = ogTask.tags
      .filter((tag) => !newTagsSet.has(tag.name))
      .map((t) => t.name);

    // related tasks
    const relationsData = (await getRelatedTasks.run(ogTask.id)).data;
    const ogRelationsSet = new Set(
      relationsData.map(
        (relatedTask) => `${relatedTask.relationType}|${relatedTask.task.id}`
      )
    );
    const newRelationsSet = new Set(
      newRelatedTasks.map(
        (relation) => `${relation.relationType}|${relation.task.id}`
      )
    );
    const relationsToAdd = newRelatedTasks
      .filter(
        (relation) =>
          !ogRelationsSet.has(`${relation.relationType}|${relation.task.id}`)
      )
      .map(({ relationType, task }) => ({
        type: relationType,
        taskId: task.id,
      }));
    const relationsToDelete = [...ogRelationsSet]
      .filter(
        (relation) =>
          !newRelationsSet.has(relation) &&
          !relation.startsWith(DirectedRelationType.Subtask) &&
          !relation.startsWith(DirectedRelationType.Supertask)
      )
      .map((relation) => {
        const [type, id] = relation.split("|");

        return relationsData.find(
          (r) => r.relationType === type && r.task.id === id
        )?.relationId;
      })
      .filter(Boolean) as string[];

    // subtasks
    const ogSubtaskSet = new Set(
      relationsData
        .filter(
          (relation) => relation.relationType === DirectedRelationType.Subtask
        )
        .map((r) => r.task.id)
    );
    const subtasksToAdd = newSubtasks.filter((s) => !s.id).map((s) => s.title);
    ogSubtaskSet.forEach((id) => {
      if (newSubtasks.find((s) => s.id === id) === undefined) {
        const relationId = relationsData.find(
          (relation) => relation.task.id === id
        )?.relationId;

        if (relationId) relationsToDelete.push(relationId);
      }
    });

    // send data
    const variables: EditTaskApiInput = {
      ...inputs,
      tagsToAdd,
      tagsToDelete,
      relationsToAdd,
      relationsToDelete,
      subtasksToAdd,
    };

    return editTask.mutateAsync(variables);
  };

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
        <TaskForm task={data.data} onSubmit={onSubmit} />
      </div>
    </Layout>
  );
}
