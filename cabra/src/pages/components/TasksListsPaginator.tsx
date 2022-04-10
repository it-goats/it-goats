import tw, { styled } from "twin.macro";
import { useEffect, useState } from "react";

import { ITask } from "../../types/task";
import ReactPaginate from "react-paginate";
import SelectBox from "./SelectBox";
import Task from "./Task";

const Container = styled.div(tw`text-gray-50 w-full space-y-4`);

interface Props {
  items: ITask[];
}

export default function TasksListsPaginator({ items }: Props) {
  const [paginatedItems, setPaginatedItems] = useState<ITask[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [itemOffset, setItemOffset] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setPaginatedItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, items, itemsPerPage]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  const paginationSelectBoxCallback = (selectedValue: number) => {
    setItemsPerPage(selectedValue);
  };

  return (
    <>
      <div>
        <Container>
          {paginatedItems &&
            paginatedItems.map((item: ITask) => (
              <Task key={item.id} task={item} detailsLink />
            ))}
        </Container>
      </div>

      <div>
        Items per page: {itemsPerPage}
        <SelectBox parentCallback={paginationSelectBoxCallback} />
      </div>

      <div>
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="< previous"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          tw="flex justify-evenly self-stretch object-fill"
        />
      </div>
    </>
  );
}
