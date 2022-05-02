import "twin.macro";

import Select, { StylesConfig } from "react-select";

import { DATE_FORMAT } from "../../utils/dates";
import DatePicker from "react-datepicker";
import { IFilterFormState } from "../../types/filterFormState";
import { ITag } from "../../types/task";
import { format } from "date-fns";
import { getTags } from "../../api/tags";
import { styled } from "twin.macro";
import tw from "twin.macro";
import { useQuery } from "react-query";

type SelectOption = {
  label: string;
  value: string;
};

type Props = {
  setFilters: (filters: IFilterFormState) => void;
  filters: IFilterFormState;
};

export type FilterFormInputs = IFilterFormState;

const selectStyles: StylesConfig<SelectOption, true> = {
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
  { value: "none", label: "None" },
];

const Container = styled.div(
  tw`p-4 bg-primary rounded-lg text-white space-y-3`
);
const InputContainer = styled.div(
  tw`rounded-lg p-1.5 bg-secondary flex justify-items-stretch items-center space-x-5`
);
const Label = styled.label(tw`w-1/12`);

export default function FilterForm({ filters, setFilters }: Props) {
  const { data: tagsData } = useQuery(getTags.cacheKey, getTags.run);

  return (
    <Container>
      <h1 tw="text-xl font-bold">Filtering</h1>
      <InputContainer>
        <Label>Tags:</Label>
        <Select
          tw="flex-1"
          options={tagsData?.data.map(mapTagToOption)}
          styles={selectStyles}
          isMulti
          onChange={(options) =>
            setFilters({
              ...filters,
              tagNames: options.map(({ value }) => value),
            })
          }
        />
      </InputContainer>
      <InputContainer>
        <Label>Status:</Label>
        <Select
          tw="flex-1"
          options={statusOptions}
          styles={selectStyles}
          onChange={(option) => {
            // that's probably only one opion to achieve what we want :v (react-select <3)
            const value: string = (option as unknown as SelectOption).value;
            setFilters({ ...filters, status: value === "done" });
          }}
        />
      </InputContainer>
      <InputContainer>
        <Label htmlFor="task-title-pattern">Title:</Label>
        <input
          tw="text-black flex-1 rounded-lg"
          id="task-title-pattern"
          type="text"
          placeholder="Task title"
          value={filters.titlePattern || ""}
          onChange={(e) =>
            setFilters({ ...filters, titlePattern: e.target.value })
          }
        />
      </InputContainer>
      <InputContainer>
        <Label>Date from:</Label>
        <DatePicker
          onChange={(v) => {
            // eslint-disable-next-line no-console
            // console.log(v);
            setFilters({ ...filters, dateFrom: v });
          }}
          value={
            filters.dateFrom ? format(filters.dateFrom, DATE_FORMAT) : undefined
          }
          id="date-from"
          placeholderText="Date from"
          dateFormat={DATE_FORMAT}
          tw="text-black rounded-lg"
        />
      </InputContainer>
      <InputContainer>
        <Label>Date to:</Label>
        <DatePicker
          onChange={(v) => {
            // eslint-disable-next-line no-console
            // console.log(v);
            setFilters({ ...filters, dateTo: v });
          }}
          value={
            filters.dateTo ? format(filters.dateTo, DATE_FORMAT) : undefined
          }
          id="date-to"
          placeholderText="Date to"
          dateFormat={DATE_FORMAT}
          tw="text-black rounded-lg flex-1"
        />
      </InputContainer>
    </Container>
  );
}
