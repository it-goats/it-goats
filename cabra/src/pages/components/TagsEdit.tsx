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

  //   const [selectedTags, setSelectedTags] = useState<
  //     { value: string; label: string }[]
  //   >(tags.map((item) => ({ value: item.id, label: item.name })));
  const [selectedTags, setSelectedTags] = useState<string[]>(
    tags.map((item) => item.name)
  );

  const { data, isLoading, error } = useQuery(getTags.cacheKey, getTags.run);

  if (isLoading) return <Label>Loading</Label>;
  if (error || !data?.data) return <Label>Oops</Label>;

  //   const options: { value: string; label: string }[] = data.data.map((item) => ({
  //     value: item.id,
  //     label: item.name,
  //   }));
  const options: string[] = data.data.map((item) => item.name);

  const onChangeHandle = (
    newValue: MultiValue<string>,
    actionMeta: ActionMeta<string>
  ) => {
    if (
      actionMeta.action == "remove-value" ||
      actionMeta.action == "pop-value"
    ) {
      //   removeTag.mutateAsync({ name: actionMeta.removedValue.label });
      removeTag.mutateAsync({ name: actionMeta.removedValue });
    } else if (actionMeta.action == "clear") {
      //   actionMeta.removedValues.forEach((value) =>
      //     removeTag.mutateAsync({ name: value.label })
      //   );
      actionMeta.removedValues.forEach((value) =>
        removeTag.mutateAsync({ name: value })
      );
    } else if (
      actionMeta.action == "create-option" ||
      actionMeta.action == "select-option"
    ) {
      //   newValue.forEach((item) => addTag.mutateAsync({ name: item.label }));
      newValue.forEach((item) => addTag.mutateAsync({ name: item }));

      //   newValue.length && addTag.mutateAsync({name: newValue.at(-1).label})
    }
    // setSelectedTags(newValue);
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
