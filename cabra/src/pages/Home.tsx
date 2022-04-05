import "twin.macro";

import CreateTaskForm from "./components/CreateTaskForm";
import Layout from "./components/Layout";
import RandomGoat from "./components/RandomGoat";
import TasksList from "./components/TasksList";

export default function HomePage() {
  return (
    <Layout>
      <div tw="w-[90%] max-w-xl space-y-6 relative z-10">
        <CreateTaskForm />
        <TasksList />
      </div>
      <RandomGoat />
    </Layout>
  );
}
