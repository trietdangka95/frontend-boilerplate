"use client";

import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import { useTable, type RowData } from "@tanstack/react-table";
import { Search } from "lucide-react";

import { LoadingState } from "@/components/ui/LoadingState";

import { dataTableFeatures } from "./features";
import type { DataTableProps } from "./types";

export function DataTable<TData extends RowData>({
  columns,
  data,
  emptyMessage = "No records found.",
  error,
  globalFilterPlaceholder = "Search table",
  initialPageSize = 5,
  isLoading = false,
  pageSizeOptions = [5, 10, 25],
}: DataTableProps<TData>) {
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    getColumnCanGlobalFilter: (column) => column.id !== "actions",
    globalFilterFn: "includesString",
    initialState: {
      globalFilter: "",
      pagination: {
        pageIndex: 0,
        pageSize: initialPageSize,
      },
      sorting: [],
    },
  });

  const { globalFilter, pagination } = table.state;
  const visibleColumns = table.getAllLeafColumns().length || 1;
  const rowCount = table.getFilteredRowModel().rows.length;
  const resolvedPageSizeOptions = pageSizeOptions.includes(initialPageSize)
    ? pageSizeOptions
    : [initialPageSize, ...pageSizeOptions].sort((first, second) => first - second);

  return (
    <Paper className="overflow-hidden" variant="outlined">
      <div className="flex flex-col gap-3 border-b border-default p-4 sm:flex-row sm:items-center sm:justify-between">
        <TextField
          className="max-w-md"
          fullWidth
          label={globalFilterPlaceholder}
          onChange={(event) => {
            table.setGlobalFilter(event.target.value);
          }}
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search aria-hidden="true" size={17} strokeWidth={1.8} />
                </InputAdornment>
              ),
            },
          }}
          placeholder={globalFilterPlaceholder}
          value={String(globalFilter ?? "")}
        />
        <span className="text-xs font-medium text-muted">
          {rowCount} {rowCount === 1 ? "record" : "records"}
        </span>
      </div>

      <TableContainer>
        <Table aria-busy={isLoading} size="small">
          <TableHead className="bg-surface-subtle">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sortDirection = header.column.getIsSorted();
                  const canSort = header.column.getCanSort();

                  return (
                    <TableCell
                      key={header.id}
                      sortDirection={sortDirection === false ? false : sortDirection}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <TableSortLabel
                          active={Boolean(sortDirection)}
                          direction={sortDirection === "desc" ? "desc" : "asc"}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <table.FlexRender header={header} />
                        </TableSortLabel>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={visibleColumns}>
                  <LoadingState className="py-3" label="Loading data..." />
                </TableCell>
              </TableRow>
            ) : null}

            {!isLoading && error ? (
              <TableRow>
                <TableCell
                  className="py-10 text-center text-error"
                  colSpan={visibleColumns}
                  role="alert"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : null}

            {!isLoading && !error && table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  className="py-10 text-center text-muted"
                  colSpan={visibleColumns}
                  role="status"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : null}

            {!isLoading && !error
              ? table.getRowModel().rows.map((row) => (
                  <TableRow data-testid="data-table-row" hover key={row.id}>
                    {row.getAllCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rowCount}
        onPageChange={(_, pageIndex) => table.setPageIndex(pageIndex)}
        onRowsPerPageChange={(event) => {
          table.setPageSize(Number(event.target.value));
        }}
        page={pagination.pageIndex}
        rowsPerPage={pagination.pageSize}
        rowsPerPageOptions={resolvedPageSizeOptions}
      />
    </Paper>
  );
}
