import "twin.macro";

import tw, { styled } from "twin.macro";

import Select from "react-select";
import { getTags } from "../../api/tags";
import { useQuery } from "react-query";

const Container = styled.div(tw`bg-secondary`);

export default function TagFilter() {
  const { data, isLoading, error } = useQuery(getTags.cacheKey, () =>
    getTags.run()
  );

  if (isLoading) return <Container>Loading...</Container>;
  if (error) return <Container>Oops! An error occured.</Container>;
  if (!data?.data) return <Container />;

  return (
    <Container>
      <Select
        isMulti
        options={data?.data.map((tag) => ({
          value: tag.name,
          label: tag.name,
        }))}
      />
    </Container>
  );
}
