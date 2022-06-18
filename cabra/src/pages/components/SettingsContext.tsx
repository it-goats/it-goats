import "twin.macro";

import { ReactNode, createContext, useMemo } from "react";
import { getSettings, updateSettings } from "../../api/settings";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { CogIcon } from "@heroicons/react/solid";
import { ISettings } from "../../types/settings";
import { Link } from "react-router-dom";
import NavigationButton from "./NavigationButton";
import { routeHelpers } from "../../routes";

interface SettingsValue extends ISettings {
  updateSettings: (settings: ISettings) => void;
}

const defaultValue: SettingsValue = {
  email: null,
  updateSettings: () => undefined,
};

export const SettingsContext = createContext<SettingsValue>(defaultValue);

function SettingsProvider({ children }: { children: ReactNode }) {
  const client = useQueryClient();
  const { data: settings } = useQuery(getSettings.cacheKey, getSettings.run);
  const { mutateAsync: update } = useMutation(updateSettings, {
    onSuccess: () => {
      client.invalidateQueries(getSettings.cacheKey);
    },
  });

  const value = useMemo(
    () => ({ ...(settings?.data ?? defaultValue), updateSettings: update }),
    [update, settings?.data]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
      {settings?.data && (
        <Link to={routeHelpers.settings} tw="fixed right-8 top-5 z-50">
          <NavigationButton tw="bg-secondary text-white">
            <CogIcon width={20} height={20} /> Settings
          </NavigationButton>
        </Link>
      )}
    </SettingsContext.Provider>
  );
}

export default SettingsProvider;
