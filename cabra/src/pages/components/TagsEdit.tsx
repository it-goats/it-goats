import { ActionMeta, MultiValue } from "react-select";
import { createTag, deleteTag, getTags } from "../../api/tags";
import tw, { styled } from "twin.macro";
import { useMutation, useQuery, useQueryClient } from "react-query";

import Creatable from "react-select/creatable";
import { ITag } from "../../types/task";
import { getTask } from "../../api/tasks";
import { useState } from "react";

interface Props {
  tags: ITag[];
  taskId: string;
}

interface TagOption {
  value: string;
  label: string;
}

const Label = styled.label(tw`text-gray-50 font-bold`);

export function TagsEdit({ tags, taskId }: Props) {
  const client = useQueryClient();

  const addTag = useMutation(createTag(taskId), {
    onSuccess: () => {
      client.invalidateQueries(getTask.cacheKey(taskId));
    },
  });

  const removeTag = useMutation(deleteTag(taskId), {
    onSuccess: () => {
      client.invalidateQueries(getTask.cacheKey(taskId));
    },
  });

  const [selectedTags, setSelectedTags] = useState<TagOption[]>(
    tags.map((item) => ({ value: item.id, label: item.name }))
  );

  const { data, isLoading, error } = useQuery(getTags.cacheKey, getTags.run);

  if (isLoading) return <Label>Loading</Label>;
  if (error || !data?.data) return <Label>Oops</Label>;

  const options: TagOption[] = data.data.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const onChangeHandle = (
    newValue: MultiValue<TagOption>,
    actionMeta: ActionMeta<TagOption>
  ) => {
    if (
      actionMeta.action == "remove-value" ||
      actionMeta.action == "pop-value"
    ) {
      removeTag.mutateAsync({ name: actionMeta.removedValue.label });
    } else if (actionMeta.action == "clear") {
      actionMeta.removedValues.forEach((value) =>
        removeTag.mutateAsync({ name: value.label })
      );
    } else if (
      actionMeta.action == "create-option" ||
      actionMeta.action == "select-option"
    ) {
      newValue.forEach((item) => addTag.mutateAsync({ name: item.label }));
    }
    setSelectedTags([...newValue]);
  };

  return (
    <Creatable
      isMulti
      value={selectedTags}
      options={options}
      onChange={onChangeHandle}
    />
  );
}
