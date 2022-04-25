import "twin.macro";

import { ArrowLeftIcon } from "@heroicons/react/solid";
import CreateTaskForm from "./components/CreateTaskForm";
import Layout from "./components/Layout";
import NavigationButton from "./components/NavigationButton";
import { useNavigate } from "react-router-dom";

export default function TaskCreate() {
  const navigate = useNavigate();
  return (
    <Layout>
      <div tw="w-[90%] max-w-2xl p-4 rounded-xl bg-primary shadow-2xl">
        <div tw="flex justify-between items-end mb-4">
          <h1 tw="text-2xl text-stone-50 font-bold ">Create new task</h1>
          <NavigationButton
            tw="text-stone-50 bg-secondary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon height={20} width={20} />
            Go Back
          </NavigationButton>
        </div>
        <CreateTaskForm />
      </div>
    </Layout>
  );
}
