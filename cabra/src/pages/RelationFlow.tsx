import tw, { styled } from "twin.macro";

import { ArrowLeftIcon } from "@heroicons/react/solid";
import { ITask } from "../types/task";
import Layout from "./components/Layout";
import { Link } from "react-router-dom";
import NavigationButton from "./components/NavigationButton";
import Select from "react-select";
import { getTasks } from "../api/tasks";
import { useQuery } from "react-query";
import { useState } from "react";

const Container = styled.div(tw`text-gray-50 w-full space-y-4`);

interface TaskOption {
  value: ITask;
  label: string;
}

export default function RelationFlow() {
  const [selectedTask, setSelectedTask] = useState<ITask>();

  const { data, isLoading, isError } = useQuery(getTasks.cacheKey(), () =>
    getTasks.run()
  );

  const tasks = isError || !data ? null : data.data;

  if (isLoading) return <Container>Loading</Container>;
  if (isError || !data?.data) return <Container>Oops</Container>;

  const formattedTasks: Partial<TaskOption>[] = tasks
    ? tasks.map((task) => ({ value: task, label: task.title }))
    : [{ label: "Your task list is empty" }];

  return (
    <Layout>
      <div tw="w-[90%] max-w-4xl space-y-6 relative z-10">
        <div tw="w-full flex justify-between gap-x-2">
          <Link to="..">
            <NavigationButton tw="bg-secondary text-stone-50">
              <ArrowLeftIcon width={20} height={20} /> Return
            </NavigationButton>
          </Link>
        </div>
        <div>
          Relation Flow component
          <Layout>
            <div tw="text-gray-50 font-bold mb-3">Select the task:</div>
            <div tw="flex space-x-5 justify-evenly self-stretch object-fill mb-3">
              <Select
                onChange={(selected) => {
                  if (selected?.value) {
                    setSelectedTask(selected.value);
                  }
                }}
                options={formattedTasks}
                key={`unique_select_key__${selectedTask}`}
                tw="flex-1"
              />
            </div>
            {`Selected task: ${selectedTask?.title}`}
          </Layout>
        </div>
      </div>
    </Layout>
  );
}
