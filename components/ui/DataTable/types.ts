import type { ColumnDef, RowData } from "@tanstack/react-table";
import type { ReactNode } from "react";

import type { dataTableFeatures } from "./features";

export type DataTableColumnDef<TData extends RowData> = ColumnDef<typeof dataTableFeatures, TData>;

export interface DataTableProps<TData extends RowData> {
  columns: Array<DataTableColumnDef<TData>>;
  data: TData[];
  emptyMessage?: ReactNode;
  error?: ReactNode;
  globalFilterPlaceholder?: string;
  initialPageSize?: number;
  isLoading?: boolean;
  pageSizeOptions?: number[];
}
