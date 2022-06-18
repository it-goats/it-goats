import "twin.macro";

import { ArrowLeftIcon } from "@heroicons/react/solid";
import Layout from "./components/Layout";
import NavigationButton from "./components/NavigationButton";
import SettingsForm from "./components/SettingsForm";
import { useNavigate } from "react-router-dom";

function SettingsPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div tw="w-[90%] max-w-2xl p-4 rounded-xl bg-primary shadow-2xl">
        <div tw="flex justify-between items-end mb-4">
          <h1 tw="text-2xl text-stone-50 font-bold ">Settings</h1>
          <NavigationButton
            tw="text-stone-50 bg-secondary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon height={20} width={20} />
            Go Back
          </NavigationButton>
        </div>
        <SettingsForm />
      </div>
    </Layout>
  );
}

export default SettingsPage;
