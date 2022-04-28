import { ActionMeta, MultiValue } from "react-select";
import { createTag, deleteTag, getTags } from "../../api/tags";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { ITag } from "../../types/task";
import { getTask } from "../../api/tasks";
import { useState } from "react";

interface Props {
  tags: ITag[];
  taskId: string;
}

export interface TagOption {
  value: string;
  label: string;
}

const useTags = ({ tags, taskId }: Props) => {
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
    tags.map(({ id, name }) => ({ value: id, label: name }))
  );

  const { data, isLoading, error } = useQuery(getTags.cacheKey, getTags.run);

  const allTags = data?.data as ITag[];

  const onChangeHandle = (
    newValue: MultiValue<TagOption>,
    { action, removedValue, removedValues }: ActionMeta<TagOption>
  ) => {
    if (action === "remove-value" || action === "pop-value") {
      removeTag.mutateAsync({ name: removedValue.label });
    } else if (action === "clear") {
      removedValues.forEach(({ label }) =>
        removeTag.mutateAsync({ name: label })
      );
    } else if (action === "create-option" || action === "select-option") {
      newValue.forEach(({ label }) => addTag.mutateAsync({ name: label }));
    }
    setSelectedTags([...newValue]);
  };

  return { selectedTags, allTags, onChangeHandle, isLoading, error };
};

export default useTags;
