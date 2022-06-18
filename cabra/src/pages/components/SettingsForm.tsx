import "twin.macro";

import * as yup from "yup";

import { useContext, useEffect } from "react";

import { ISettings } from "../../types/settings";
import { SettingsContext } from "./SettingsContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  email: yup.string().email().nullable(),
});

function SettingsForm() {
  const { email, updateSettings } = useContext(SettingsContext);

  const {
    formState: { errors, isSubmitting, isSubmitSuccessful },
    handleSubmit,
    register,
    setValue,
  } = useForm<ISettings>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue("email", email);
  }, [email, setValue]);

  async function onSubmit(data: ISettings) {
    await updateSettings(data);
  }

  return (
    <form tw="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
      <label tw="text-gray-50 font-bold" htmlFor="email">
        Notification email:
      </label>
      <input
        id="email"
        placeholder="mail@example.com"
        type="email"
        tw="w-full px-4 py-2 rounded-lg shadow-2xl bg-tertiary text-black placeholder:text-primary/60"
        {...register("email")}
      />
      <div tw="text-red-500 pt-1">
        &nbsp;{errors.email?.message ? "Please enter a valid email!" : ""}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        tw="bg-green-500 mt-4 py-2 text-white font-semibold rounded shadow-2xl transition-transform transform hover:scale-[102%] disabled:opacity-50"
      >
        Submit!
      </button>
      {isSubmitSuccessful && (
        <div tw="text-stone-50 pt-1 mb-6">Settings saved!</div>
      )}
    </form>
  );
}

export default SettingsForm;
