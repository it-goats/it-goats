import "twin.macro";

import Layout from "./components/Layout";
import RandomGoat from "./components/RandomGoat";
import TaskForm from "./components/TaskForm";
import TasksList from "./components/TasksList";

export default function HomePage() {
  return (
    <Layout>
      <div tw="w-[90%] max-w-xl space-y-6 relative z-10">
        <TaskForm />
        <TasksList />
      </div>
      <RandomGoat />
    </Layout>
  );
}
