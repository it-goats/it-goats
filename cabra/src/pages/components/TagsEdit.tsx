import { Controller, useFormContext } from "react-hook-form";
import tw, { styled } from "twin.macro";

import { CSSObjectWithLabel } from "react-select";
import Creatable from "react-select/creatable";
import { TaskFormInputs } from "./TaskForm";
import useAvailableTags from "../hooks/useAvailableTags";

const Label = styled.label(tw`text-gray-50 font-bold`);

const selectStyles = {
  option: (provided: CSSObjectWithLabel) => ({
    ...provided,
    color: "black",
    fontWeight: "normal",
    padding: 8,
  }),
  control: (provided: CSSObjectWithLabel) => ({
    ...provided,
    borderRadius: "8px",
    fontWeight: "normal",
    backgroundColor: "#beccef",
  }),
};

const tagNameToOption = (tagName: string) => ({
  value: tagName,
  label: tagName,
});

export function TagsEdit() {
  const form = useFormContext<TaskFormInputs>();
  const { tags, isLoading, error, createTag } = useAvailableTags();

  if (isLoading)
    return (
      <div tw="mt-3 mb-8">
        <Label>Tags:</Label>
        <Label>Loading</Label>
      </div>
    );

  if (error)
    return (
      <div tw="mt-3 mb-8">
        <Label>Tags:</Label>
        <Label>Oops!</Label>
      </div>
    );

  const options = tags.map(({ name }) => tagNameToOption(name));

  return (
    <div tw="mt-3 mb-8">
      <Label>Tags:</Label>
      <Controller
        name="tags"
        control={form.control}
        render={({ field: { value, onChange } }) => (
          <Creatable
            isMulti
            onChange={(selectedTags) =>
              onChange(selectedTags.map(({ value }) => value))
            }
            options={options}
            onCreateOption={(tagName) =>
              createTag(tagName).then(() => onChange([...value, tagName]))
            }
            value={value.map(tagNameToOption)}
            styles={selectStyles}
          />
        )}
      ></Controller>
    </div>
  );
}
