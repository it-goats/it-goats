import { addTag, getTags } from "../../api/tags";
import { useMutation, useQuery } from "react-query";

function useAvailableTags() {
  const { data, isLoading, error, refetch } = useQuery(
    getTags.cacheKey,
    getTags.run
  );
  const { mutateAsync } = useMutation(addTag, { onSuccess: () => refetch() });

  return { tags: data?.data ?? [], isLoading, error, createTag: mutateAsync };
}

export default useAvailableTags;
