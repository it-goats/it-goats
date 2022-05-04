import "twin.macro";

import FilterForm from "./components/FilterForm";
import { IFilterFormState } from "../types/filterFormState";
import Layout from "./components/Layout";
import { Link } from "react-router-dom";
import NavigationButton from "./components/NavigationButton";
import { PlusIcon } from "@heroicons/react/solid";
import TasksList from "./components/TasksList";
import { getTasks } from "../api/tasks";
import { routeHelpers } from "../routes";
import { useQuery } from "react-query";
import { useState } from "react";

export default function HomePage() {
  const [filters, setFilters] = useState<IFilterFormState>({
    tagNames: null,
    status: null,
    titlePattern: null,
    dateFrom: null,
    dateTo: null,
  });

  const { data, isLoading, error } = useQuery(
    getTasks.cacheKey(filters),
    () => getTasks.run(filters),
    { keepPreviousData: true }
  );

  const tasks = error || !data ? null : data.data;

  return (
    <Layout>
      <div tw="w-[90%] max-w-2xl space-y-6 relative z-10">
        <div tw="w-full flex justify-end">
          <Link to={routeHelpers.task.new}>
            <NavigationButton tw="bg-secondary text-stone-50">
              <PlusIcon width={20} height={20} /> Add new task
            </NavigationButton>
          </Link>
        </div>
        <FilterForm filters={filters} setFilters={setFilters} />
        <TasksList isLoading={isLoading} tasks={tasks} />
      </div>
    </Layout>
  );
}
