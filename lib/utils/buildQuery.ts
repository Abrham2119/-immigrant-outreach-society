export type Status = "all" | "pending" | "approved" | "rejected";

export interface QueryParams {
  search?: string;
  page: number;
  pageSize: number;
  status?: Status | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const buildQuery = ({
  search,
  page,
  pageSize,
  status,
  sortBy,
  sortOrder,
}: QueryParams): string => {
  const params = new URLSearchParams();

  params.append("page_size", pageSize.toString());
  params.append("page_num", page.toString());

  if (search) params.append("search", search.trim());
  if (status) params.append("status", status);
  if (sortBy) params.append("sort_by", sortBy);
  if (sortOrder) params.append("sort_order", sortOrder);

  return `?${params.toString()}`;
};
