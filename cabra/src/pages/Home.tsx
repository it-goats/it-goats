import "twin.macro";

import Layout from "./components/Layout";
import { Link } from "react-router-dom";
import NavigationButton from "./components/NavigationButton";
import { PlusIcon } from "@heroicons/react/solid";
import TasksList from "./components/TasksList";
import { routeHelpers } from "../routes";

export default function HomePage() {
  return (
    <Layout>
      <div tw="w-[90%] max-w-xl space-y-6 relative z-10">
        <div tw="w-full flex justify-end">
          <Link to={routeHelpers.task.new}>
            <NavigationButton tw="bg-secondary text-stone-50">
              <PlusIcon width={20} height={20} /> Add new task
            </NavigationButton>
          </Link>
        </div>
        <TasksList />
      </div>
    </Layout>
  );
}
