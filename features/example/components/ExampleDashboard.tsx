"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Chip from "@mui/material/Chip";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { appToast } from "@/components/common/AppToast";
import { Button } from "@/components/ui/Button";
import { CheckboxField } from "@/components/ui/CheckboxField";
import { DataTable } from "@/components/ui/DataTable";
import { InputField } from "@/components/ui/InputField";
import { Modal } from "@/components/ui/Modal";
import { SelectBox } from "@/components/ui/SelectBox";

import { useCreateExampleRecord, useExampleRecords } from "../hooks/use-example-records";
import {
  exampleRecordSchema,
  type ExampleRecordFormValues,
} from "../schemas/example-record-schema";
import type { ExampleRecord, ExampleRecordStatus } from "../types";

const statusColor: Record<ExampleRecordStatus, "default" | "info" | "success" | "warning"> = {
  ACTIVE: "success",
  DRAFT: "info",
  PAUSED: "warning",
};

export function ExampleDashboard() {
  const [selectedRecord, setSelectedRecord] = useState<ExampleRecord | null>(null);
  const recordsQuery = useExampleRecords();
  const createRecord = useCreateExampleRecord();
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = useForm<ExampleRecordFormValues>({
    defaultValues: {
      name: "",
      notifyOwner: true,
      owner: "",
      status: "DRAFT",
    },
    resolver: zodResolver(exampleRecordSchema),
  });

  const columns = useMemo<Array<ColumnDef<ExampleRecord>>>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "owner",
        header: "Owner",
      },
      {
        accessorKey: "status",
        cell: ({ row }) => (
          <Chip color={statusColor[row.original.status]} label={row.original.status} size="small" />
        ),
        header: "Status",
      },
      {
        accessorKey: "createdAt",
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("en-US"),
        header: "Created",
      },
      {
        cell: ({ row }) => (
          <Button
            aria-label={`View ${row.original.name}`}
            className="px-2"
            onClick={() => setSelectedRecord(row.original)}
            startIcon={<Eye aria-hidden="true" className="h-4 w-4" />}
            variant="text"
          >
            View
          </Button>
        ),
        enableSorting: false,
        header: "Actions",
        id: "actions",
      },
    ],
    [],
  );

  const onSubmit = handleSubmit(async (values) => {
    const record = await createRecord.mutateAsync(values);
    appToast.success(`${record.name} created`);
    reset({
      name: "",
      notifyOwner: true,
      owner: "",
      status: "DRAFT",
    });
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-blue-700">Enterprise frontend boilerplate</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-slate-950">
            Example workspace
          </h1>
          <p className="max-w-3xl leading-7 text-slate-600">
            A compact sample that exercises form validation, query caching, toasts, modal details,
            and a paginated data table without assuming a product domain.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(280px,380px)_1fr]">
          <form
            className="flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-5"
            onSubmit={onSubmit}
          >
            <div>
              <h2 className="text-lg font-semibold tracking-normal">Create record</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Zod validates the form before React Query updates the table.
              </p>
            </div>

            <InputField control={control} label="Name" name="name" />
            <InputField control={control} label="Owner email" name="owner" type="email" />
            <SelectBox
              control={control}
              label="Status"
              name="status"
              options={[
                { label: "Draft", value: "DRAFT" },
                { label: "Active", value: "ACTIVE" },
                { label: "Paused", value: "PAUSED" },
              ]}
            />
            <CheckboxField control={control} label="Notify owner" name="notifyOwner" />

            <Button
              disabled={createRecord.isPending || isSubmitting}
              isLoading={createRecord.isPending}
              type="submit"
            >
              Create record
            </Button>
          </form>

          <section className="flex flex-col gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-normal">Records</h2>
              <p className="mt-1 text-sm text-slate-600">
                Sort, search, and paginate through cached query data.
              </p>
            </div>
            <DataTable
              columns={columns}
              data={recordsQuery.data ?? []}
              error={recordsQuery.error ? "Unable to load example records." : undefined}
              initialPageSize={3}
              isLoading={recordsQuery.isLoading}
            />
          </section>
        </section>
      </div>

      <Modal
        onClose={() => setSelectedRecord(null)}
        open={Boolean(selectedRecord)}
        title={selectedRecord?.name ?? "Record details"}
      >
        {selectedRecord ? (
          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="font-semibold text-slate-950">Owner</dt>
              <dd>{selectedRecord.owner}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">Status</dt>
              <dd>{selectedRecord.status}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-950">Created</dt>
              <dd>{new Date(selectedRecord.createdAt).toLocaleString("en-US")}</dd>
            </div>
          </dl>
        ) : null}
      </Modal>
    </main>
  );
}
