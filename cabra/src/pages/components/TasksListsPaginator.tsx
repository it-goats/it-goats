import tw, { styled } from "twin.macro";
import { useEffect, useState } from "react";

import { ITask } from "../../types/task";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import TaskListItem from "./TaskListItem";

const Container = styled.div(tw`text-gray-50 w-full space-y-4`);

interface Props {
  items: ITask[];
}
interface PaginationOption {
  readonly value: number;
  readonly label: string;
}

const paginationOptions: PaginationOption[] = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 100, label: "100" },
];

export default function TasksListsPaginator({ items }: Props) {
  const [paginatedItems, setPaginatedItems] = useState<ITask[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const DEFAULT_ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setPaginatedItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, items, itemsPerPage]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <div>
        <Container>
          {paginatedItems?.map((item: ITask) => (
            <TaskListItem key={item.id} task={item} />
          ))}
        </Container>
      </div>

      <div tw="text-primary">
        Items per page: {itemsPerPage}
        <Select
          onChange={(selected) =>
            setItemsPerPage(selected?.value ?? DEFAULT_ITEMS_PER_PAGE)
          }
          options={paginationOptions}
          value={paginationOptions.find(({ value }) => value === itemsPerPage)}
        />
      </div>

      <div tw="text-primary">
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="< previous"
          tw="flex justify-evenly self-stretch object-fill"
        />
      </div>
    </>
  );
}
