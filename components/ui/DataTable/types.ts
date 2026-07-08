import type { ColumnDef, RowData } from "@tanstack/react-table";
import type { ReactNode } from "react";

export interface DataTableProps<TData extends RowData> {
  columns: Array<ColumnDef<TData>>;
  data: TData[];
  emptyMessage?: ReactNode;
  error?: ReactNode;
  globalFilterPlaceholder?: string;
  initialPageSize?: number;
  isLoading?: boolean;
  pageSizeOptions?: number[];
}
