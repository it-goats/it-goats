import "twin.macro";

import Select, { StylesConfig } from "react-select";

import { getTags } from "../../api/tags";
import { styled } from "twin.macro";
import { useQuery } from "react-query";

type IsMulti = true;

type SelectOption = {
  label: string;
  value: string;
};

const tagsSelectStyles: StylesConfig<SelectOption, IsMulti> = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#071275",
    padding: "5px",
    borderRadius: "40px",
  }),
};

const Container = styled.div();

export default function FilterForm() {
  const {
    data: tagsData,
    isLoading,
    error,
  } = useQuery(getTags.cacheKey, getTags.run);

  if (isLoading) return <Container>Loading tag filtering...</Container>;
  if (error)
    return (
      <Container>Oops! An error occured when loading tag filtering.</Container>
    );
  if (!tagsData?.data) return <Container />;

  const tagsOptions: SelectOption[] = tagsData?.data.map((tag) => ({
    value: tag.name,
    label: tag.name,
  }));

  const statusOptions: SelectOption[] = [
    { value: "done", label: "DONE" },
    { value: "notDone", label: "NOT DONE" },
    { value: "interchangableDone", label: "INTERCHANGABLE DONE" },
  ];

  return (
    <Container>
      <h1>Filters:</h1>
      <div tw="flex flex-grow">
        <p tw="block">Tags</p>
        <Select options={tagsOptions} styles={tagsSelectStyles} isMulti />
      </div>
      <div tw="flex">
        <p>Status</p>
        <Select options={statusOptions} />{" "}
      </div>
    </Container>
  );
}
