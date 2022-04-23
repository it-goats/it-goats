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
        tw="text-stone-50 bg-blue-800"
        onClick={() => navigate(-1)}
      >
        <ArrowLeftIcon height={20} width={20} /> Go Back
      </NavigationButton>
      <div tw="w-[100%] max-w-xl space-y-6 relative z-10 h-[100%]">
        <TaskDetails id={id} />
      </div>
    </Layout>
  );
}
