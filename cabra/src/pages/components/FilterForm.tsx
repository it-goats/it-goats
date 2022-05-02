import "twin.macro";

import Select, { StylesConfig } from "react-select";

import { ITag } from "../../types/task";
import { getTags } from "../../api/tags";
import { styled } from "twin.macro";
import tw from "twin.macro";
import { useQuery } from "react-query";

type IsMulti = true;

type SelectOption = {
  label: string;
  value: string;
};

const selectStyles: StylesConfig<SelectOption, IsMulti> = {
  option: (provided) => ({
    ...provided,
    color: "black",
    padding: 8,
  }),
  control: (provided) => ({
    ...provided,
    borderRadius: "12px",
  }),
};

const mapTagToOption = (tag: ITag) => ({
  value: tag.name,
  label: tag.name,
});

const statusOptions: SelectOption[] = [
  { value: "done", label: "Done" },
  { value: "notDone", label: "Not done" },
  { value: "interchangableDone", label: "Interchangable done" },
];

const MainContainer = styled.div(
  tw`p-4 bg-primary rounded-lg text-white space-y-3`
);
const ItemContainer = styled.div(
  tw`rounded-lg p-1.5 bg-secondary flex justify-items-stretch items-center space-x-5`
);

export default function FilterForm() {
  const {
    data: tagsData,
    isLoading,
    error,
  } = useQuery(getTags.cacheKey, getTags.run);

  if (isLoading) return <MainContainer>Loading tag filtering...</MainContainer>;
  if (error)
    return (
      <MainContainer>
        Oops! An error occured when loading tag filtering.
      </MainContainer>
    );
  if (!tagsData?.data) return <MainContainer />;

  return (
    <MainContainer>
      <h1 tw="text-xl font-bold">Filtering</h1>
      <ItemContainer>
        <p>Tags</p>
        <Select
          tw="flex-1"
          options={tagsData?.data.map(mapTagToOption)}
          styles={selectStyles}
          isMulti
        />
      </ItemContainer>
      <ItemContainer>
        <p>Status</p>
        <Select
          tw="flex-1"
          options={statusOptions}
          styles={selectStyles}
        />{" "}
      </ItemContainer>
    </MainContainer>
  );
}
