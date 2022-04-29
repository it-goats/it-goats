import "twin.macro";

import Select, { StylesConfig } from "react-select";

import { getTags } from "../../api/tags";
import { styled } from "twin.macro";
import { useQuery } from "react-query";

const Container = styled.div();

export default function TagFilter() {
  const { data, isLoading, error } = useQuery(getTags.cacheKey, getTags.run);

  if (isLoading) return <Container>Loading tag filtering...</Container>;
  if (error)
    return (
      <Container>Oops! An error occured when loading tag filtering.</Container>
    );
  if (!data?.data) return <Container />;

  type SelectOption = {
    label: string;
    value: string;
  };

  const options: SelectOption[] = data?.data.map((tag) => ({
    value: tag.name,
    label: tag.name,
  }));

  type IsMulti = true;

  const selectStyles: StylesConfig<SelectOption, IsMulti> = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#071275",
      padding: "5px",
      borderRadius: "40px",
    }),
  };

  return (
    <Container>
      <Select options={options} styles={selectStyles} isMulti />
    </Container>
  );
}
