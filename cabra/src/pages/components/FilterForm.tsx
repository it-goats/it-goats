import "twin.macro";

import { Dispatch, SetStateAction, useState } from "react";
import Select, { CSSObjectWithLabel } from "react-select";

import { DATE_FORMAT } from "../../utils/dates";
import DatePicker from "react-datepicker";
import { IFilterFormState } from "../../types/filterFormState";
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
  setFilters: Dispatch<SetStateAction<IFilterFormState>>;
  filters: IFilterFormState;
};

export type FilterFormInputs = IFilterFormState;

const selectStyles = {
  option: (provided: CSSObjectWithLabel) => ({
    ...provided,
    color: "black",
    padding: 8,
  }),
  control: (provided: CSSObjectWithLabel) => ({
    ...provided,
    borderRadius: "12px",
  }),
};

const statusOptions: SelectOption[] = [
  { value: "done", label: "Done" },
  { value: "todo", label: "Todo" },
  { value: "indirectlyDone", label: "Indirectly done" },
  { value: "none", label: "None" },
];

const Container = styled.div(
  tw`p-4 bg-primary rounded-lg text-white space-y-3`
);
const InputContainer = styled.div(
  tw`rounded-lg px-2 py-1 bg-secondary flex items-center space-x-5`
);
const Label = styled.label(tw`w-1/12`);

const HideButton = styled.button(
  tw`px-2 py-1 text-white font-bold bg-secondary`
);

export default function FilterForm({ filters, setFilters }: Props) {
  const { data: tagsData } = useQuery(getTags.cacheKey, getTags.run);

  const [isHidden, setIsHidden] = useState(true);

  const resetFilters = () => {
    setFilters({
      tags: null,
      status: null,
      title: null,
      dateFrom: null,
      dateTo: null,
    });
  };

  return isHidden ? (
    <Container>
      <HideButton onClick={() => setIsHidden(false)}>Show filters</HideButton>
    </Container>
  ) : (
    <Container>
      <div tw="flex flex-row justify-between hover:opacity-95 px-2">
        <HideButton onClick={() => setIsHidden(true)}>Hide filters</HideButton>
        <button
          tw="rounded-2xl bg-red-700 text-white font-bold py-0.5 px-2"
          onClick={resetFilters}
        >
          Reset filters
        </button>
      </div>
      <InputContainer>
        <Label>Tags:</Label>
        <Select
          tw="flex-1"
          options={tagsData?.data.map(({ name }) => ({
            value: name,
            label: name,
          }))}
          styles={selectStyles}
          isMulti
          onChange={(options) =>
            setFilters({
              ...filters,
              tags: options.map(({ value }) => value),
            })
          }
          value={
            filters.tags && tagsData
              ? filters.tags.map((name) => ({ value: name, label: name }))
              : []
          }
        />
      </InputContainer>
      <InputContainer>
        <Label>Status:</Label>
        <Select
          tw="flex-1"
          options={statusOptions}
          styles={selectStyles}
          onChange={(option) =>
            setFilters({
              ...filters,
              status: option ? option.value : null,
            })
          }
          value={
            filters.status
              ? statusOptions.find(({ value }) => value === filters.status)
              : null
          }
        />
      </InputContainer>
      <InputContainer>
        <Label htmlFor="task-title-pattern">Title:</Label>
        <input
          tw="text-black flex-1 rounded-lg"
          id="task-title-pattern"
          type="text"
          placeholder="Task title"
          value={filters.title || ""}
          onChange={(changeEvent) =>
            setFilters({ ...filters, title: changeEvent.target.value })
          }
        />
      </InputContainer>
      <InputContainer>
        <Label>From:</Label>
        <DatePicker
          onChange={(date) => {
            setFilters({ ...filters, dateFrom: date });
          }}
          value={
            filters.dateFrom ? format(filters.dateFrom, DATE_FORMAT) : undefined
          }
          id="date-from"
          placeholderText="Date from"
          dateFormat={DATE_FORMAT}
          tw="text-black rounded-lg"
        />
        <Label>To:</Label>
        <DatePicker
          onChange={(date) => setFilters({ ...filters, dateTo: date })}
          value={
            filters.dateTo ? format(filters.dateTo, DATE_FORMAT) : undefined
          }
          id="date-to"
          placeholderText="Date to"
          dateFormat={DATE_FORMAT}
          tw="text-black rounded-lg"
        />
      </InputContainer>
    </Container>
  );
}
