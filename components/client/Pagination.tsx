"use client"
import { usePagination } from "@/domain/hooks/usePagination";

interface PaginationProps {
  pageNum: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ pageNum, totalPages, onPageChange }) => {
  const maxVisible = 5;
  const visiblePages = usePagination(pageNum, totalPages, maxVisible);

  if (totalPages <= 1) return null;

  return (
    <div className="flex md:flex-row md:justify-between flex-col gap-3 justify-end items-center mt-4 text-sm">
      <span className="mr-2 text-[14px] font-medium">
        Showing page {pageNum} of {totalPages}
      </span>
      <div className="space-x-1">
        <button
          onClick={() => onPageChange(Math.max(pageNum - 1, 1))}
          disabled={pageNum === 1}
          className="px-2 py-1 text-[#A8A8A8] disabled:opacity-50"
        >
          {"<<"}    
        </button>
        {visiblePages.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`px-2 py-1 font-medium ${
              pageNum === num ? "text-[#2463EB]" : "text-[#A8A8A8]"
            }`}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(pageNum + 1, totalPages))}
          disabled={pageNum === totalPages}
          className="px-2 py-1 text-[#A8A8A8] disabled:opacity-50"
        >
          {">>"}
        </button>
      </div>
    </div>
  );
};