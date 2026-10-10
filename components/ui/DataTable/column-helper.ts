import { createColumnHelper, type RowData } from "@tanstack/react-table";

import { dataTableFeatures } from "./features";

export function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<typeof dataTableFeatures, TData>();
}
