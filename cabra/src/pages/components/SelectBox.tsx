import Select, { SingleValue } from "react-select";

import { useState } from "react";

export interface PaginationOption {
  readonly value: number;
  readonly label: string;
}

const paginationOptions: PaginationOption[] = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 100, label: "100" },
];

export default function SelectBox(props: {
  parentCallback: (arg0: number) => void;
}) {
  const [selectedOption, setSelectedOption] =
    useState<PaginationOption | null>();

  const handle = (e: SingleValue<PaginationOption | null>) => {
    setSelectedOption(e);
    if (e != null) {
      props.parentCallback(e.value);
    }
  };

  return (
    <Select<PaginationOption>
      defaultValue={selectedOption}
      onChange={handle}
      options={paginationOptions}
    />
  );
}
