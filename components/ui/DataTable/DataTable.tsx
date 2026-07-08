"use client";

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
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";

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
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  // TanStack Table intentionally returns stateful table helpers; this hook is the required integration API.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      globalFilter,
      pagination,
      sorting,
    },
  });

  const visibleColumns = table.getAllLeafColumns().length || 1;
  const rowCount = table.getFilteredRowModel().rows.length;

  return (
    <Paper className="overflow-hidden rounded-md border border-slate-200 shadow-none">
      <div className="border-b border-slate-200 p-4">
        <TextField
          className="max-w-sm"
          fullWidth
          label={globalFilterPlaceholder}
          onChange={(event) => {
            setPagination((current) => ({ ...current, pageIndex: 0 }));
            setGlobalFilter(event.target.value);
          }}
          size="small"
          value={globalFilter}
        />
      </div>

      <TableContainer>
        <Table size="small">
          <TableHead className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sortDirection = header.column.getIsSorted();

                  return (
                    <TableCell className="font-semibold text-slate-700" key={header.id}>
                      {header.isPlaceholder ? null : (
                        <TableSortLabel
                          active={Boolean(sortDirection)}
                          direction={sortDirection === "desc" ? "desc" : "asc"}
                          disabled={!header.column.getCanSort()}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableSortLabel>
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
                <TableCell className="py-8 text-center text-slate-600" colSpan={visibleColumns}>
                  Loading data...
                </TableCell>
              </TableRow>
            ) : null}

            {!isLoading && error ? (
              <TableRow>
                <TableCell
                  className="py-8 text-center text-red-700"
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
                  className="py-8 text-center text-slate-600"
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
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="text-slate-700" key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
        rowsPerPageOptions={pageSizeOptions}
      />
    </Paper>
  );
}
