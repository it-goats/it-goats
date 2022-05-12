import "twin.macro";

import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeftIcon } from "@heroicons/react/solid";
import Layout from "./components/Layout";
import NavigationButton from "./components/NavigationButton";
import TaskDetails from "./components/TaskDetailsCard";

export default function TaskDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };

  return (
    <Layout>
      <NavigationButton
        tw="text-stone-50 bg-secondary"
        onClick={() => navigate(-1)}
      >
        <ArrowLeftIcon height={20} width={20} /> Go Back
      </NavigationButton>
      <div tw="w-full h-full max-w-3xl space-y-6 relative z-10">
        <TaskDetails id={id} />
      </div>
    </Layout>
  );
}
