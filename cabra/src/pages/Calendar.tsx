import "twin.macro";

import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/solid";

import Layout from "./components/Layout";
import { Link } from "react-router-dom";
import NavigationButton from "./components/NavigationButton";
import TasksCalendar from "./components/TasksCalendar";
import { getTasks } from "../api/tasks";
import { routeHelpers } from "../routes";
import { useQuery } from "react-query";

function CalendarPage() {
  const { data, isLoading, isError } = useQuery(getTasks.cacheKey(), () =>
    getTasks.run()
  );

  const tasks = isError || !data ? null : data.data;

  return (
    <Layout>
      <div tw="w-[90%] max-w-4xl space-y-6 relative z-10">
        <div tw="w-full flex justify-between gap-x-2">
          <Link to="..">
            <NavigationButton tw="bg-secondary text-stone-50">
              <ArrowLeftIcon width={20} height={20} /> Return
            </NavigationButton>
          </Link>
          <Link to={routeHelpers.task.new}>
            <NavigationButton tw="bg-secondary text-stone-50">
              <PlusIcon width={20} height={20} /> Add new task
            </NavigationButton>
          </Link>
        </div>
        <TasksCalendar tasks={tasks} isLoading={isLoading} />
      </div>
    </Layout>
  );
}

export default CalendarPage;
