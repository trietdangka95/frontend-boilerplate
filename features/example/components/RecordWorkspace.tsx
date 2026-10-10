"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { appToast } from "@/components/common/AppToast";
import { Button } from "@/components/ui/Button";
import { CheckboxField } from "@/components/ui/CheckboxField";
import { createDataTableColumnHelper, DataTable } from "@/components/ui/DataTable";
import { InputField } from "@/components/ui/InputField";
import { Modal } from "@/components/ui/Modal";
import { SelectBox } from "@/components/ui/SelectBox";
import { StatusChip } from "@/components/ui/StatusChip";

import { useCreateExampleRecord, useExampleRecords } from "../hooks/use-example-records";
import {
  exampleRecordSchema,
  type ExampleRecordFormValues,
} from "../schemas/example-record-schema";
import type { ExampleRecord } from "../types";
import { RecordDetails } from "./RecordDetails";
import { statusLabel, statusTone } from "./record-status";

const iconProps = { size: 17, strokeWidth: 1.8 } as const;
const emptyRecords: ExampleRecord[] = [];
const columnHelper = createDataTableColumnHelper<ExampleRecord>();

export function RecordWorkspace() {
  const [selectedRecord, setSelectedRecord] = useState<ExampleRecord | null>(null);
  const recordsQuery = useExampleRecords();
  const createRecord = useCreateExampleRecord();
  const { control, handleSubmit, reset } = useForm<ExampleRecordFormValues>({
    defaultValues: { name: "", notifyOwner: true, owner: "", status: "DRAFT" },
    resolver: zodResolver(exampleRecordSchema),
  });

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("name", { header: "Name" }),
        columnHelper.accessor("owner", { header: "Owner" }),
        columnHelper.accessor("status", {
          cell: ({ row }) => (
            <StatusChip
              label={statusLabel[row.original.status]}
              tone={statusTone[row.original.status]}
            />
          ),
          header: "Status",
        }),
        columnHelper.accessor("createdAt", {
          cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("en-US"),
          header: "Created",
          sortFn: "alphanumeric",
        }),
        columnHelper.display({
          cell: ({ row }) => (
            <Button
              aria-label={`View ${row.original.name}`}
              onClick={() => setSelectedRecord(row.original)}
              startIcon={<Eye aria-hidden="true" {...iconProps} />}
              variant="text"
            >
              View
            </Button>
          ),
          enableSorting: false,
          header: "Actions",
          id: "actions",
        }),
      ]),
    [],
  );

  const onSubmit = handleSubmit((values) => {
    createRecord.mutate(values, {
      onSuccess: (record) => {
        appToast.success(`${record.name} created`);
        reset({ name: "", notifyOwner: true, owner: "", status: "DRAFT" });
      },
    });
  });

  return (
    <Box component="section" id="records">
      <Box sx={{ maxWidth: 680 }}>
        <Typography component="h2" variant="h2">
          Application patterns
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 3 }} variant="body1">
          A complete form-to-query flow with validation, query-owned request state, cache
          synchronization, sorting, filtering, pagination, and accessible details.
        </Typography>
      </Box>

      <Box
        sx={{
          alignItems: "start",
          display: "grid",
          gap: 6,
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "minmax(0, 1.6fr) minmax(320px, 0.7fr)",
          },
          mt: 7,
        }}
      >
        <Box sx={{ minWidth: 0, order: { xs: 2, lg: 1 } }}>
          <Stack spacing={3} sx={{ mb: 4 }}>
            <Typography component="h3" variant="h4">
              Records
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Search, sort, inspect, and paginate through cached query data.
            </Typography>
          </Stack>
          <DataTable
            columns={columns}
            data={recordsQuery.data ?? emptyRecords}
            error={recordsQuery.error ? "Unable to load example records." : undefined}
            initialPageSize={5}
            isLoading={recordsQuery.isLoading}
          />
        </Box>

        <Paper
          component="form"
          id="create-record"
          onSubmit={onSubmit}
          sx={{
            order: { xs: 1, lg: 2 },
            p: { xs: 6, sm: 7 },
            position: { lg: "sticky" },
            top: { lg: 96 },
          }}
          variant="outlined"
        >
          <Stack spacing={5}>
            <Box>
              <Typography component="h3" variant="h4">
                Create record
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 2 }} variant="body2">
                Zod validates the input; TanStack Query owns the API mutation and pending state.
              </Typography>
            </Box>
            <InputField
              autoComplete="off"
              control={control}
              disabled={createRecord.isPending}
              label="Name"
              name="name"
            />
            <InputField
              autoComplete="off"
              control={control}
              disabled={createRecord.isPending}
              label="Owner email"
              name="owner"
              type="email"
            />
            <SelectBox
              control={control}
              disabled={createRecord.isPending}
              label="Status"
              name="status"
              options={[
                { label: "Draft", value: "DRAFT" },
                { label: "Active", value: "ACTIVE" },
                { label: "Paused", value: "PAUSED" },
              ]}
            />
            <CheckboxField
              control={control}
              disabled={createRecord.isPending}
              label="Notify owner"
              name="notifyOwner"
            />
            <Button
              disabled={createRecord.isPending}
              isLoading={createRecord.isPending}
              startIcon={<Plus aria-hidden="true" {...iconProps} />}
              type="submit"
            >
              Create record
            </Button>
          </Stack>
        </Paper>
      </Box>

      <Modal
        onClose={() => setSelectedRecord(null)}
        open={Boolean(selectedRecord)}
        title={selectedRecord?.name ?? "Record details"}
      >
        {selectedRecord ? <RecordDetails record={selectedRecord} /> : null}
      </Modal>
    </Box>
  );
}
