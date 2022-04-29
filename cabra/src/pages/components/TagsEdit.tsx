import tw, { styled } from "twin.macro";
import useTags, { TagOption } from "../hooks/useTagsEdit";

import Creatable from "react-select/creatable";
import { ITag } from "../../types/task";

interface Props {
  tags: ITag[];
  taskId: string;
}

const Label = styled.label(tw`text-gray-50 font-bold`);

export function TagsEdit({ tags, taskId }: Props) {
  const { selectedTags, allTags, onChangeHandle, isLoading, error } = useTags({
    tags,
    taskId,
  });

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

  const options: TagOption[] = allTags.map(({ id, name }) => ({
    value: id,
    label: name,
  }));

  return (
    <div tw="mt-3 mb-8">
      <Label>Tags:</Label>
      <Creatable
        isMulti
        value={selectedTags}
        options={options}
        onChange={onChangeHandle}
      />
    </div>
  );
}
