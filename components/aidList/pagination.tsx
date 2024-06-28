import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FC } from "react";

interface PaginationDemoProps {
  nextPage: () => void;
  previousPage: () => void;
  setPage: (pageIndex: number) => void;
  getCanNextPage: () => boolean;
  getCanPreviousPage: () => boolean;
  pageSize: number;
  pageIndex: number;
  pageCount: number;
}

const PaginationDemo: FC<PaginationDemoProps> = ({
  nextPage,
  previousPage,
  setPage,
  pageIndex,
  pageCount,
  getCanNextPage,
  getCanPreviousPage,
}) => {
  const pageNumbers = Array.from(Array(pageCount).keys());
  const startPage = Math.max(0, pageIndex - 2);
  const endPage = Math.min(pageCount - 1, pageIndex + 2);
  const visiblePages = pageNumbers.slice(startPage, endPage + 1);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            size="sm"
            onClick={previousPage}
            disabled={!getCanPreviousPage()}
          >
            Previous
          </Button>
        </PaginationItem>
        {startPage > 0 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => setPage(0)}>1</PaginationLink>
            </PaginationItem>
            {startPage > 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}
        {visiblePages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => setPage(page)}
              isActive={pageIndex === page}
            >
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        {endPage < pageCount - 1 && (
          <>
            {endPage < pageCount - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink onClick={() => setPage(pageCount - 1)}>
                {pageCount}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextPage}
            disabled={!getCanNextPage()}
          >
            Next
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationDemo;
