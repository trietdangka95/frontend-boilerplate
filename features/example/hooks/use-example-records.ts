"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { exampleRecordKeys, exampleRecordsQueryOptions } from "../queries/example-records";
import { createExampleRecord } from "../services/example-records";
import type { ExampleRecord } from "../types";

export function useExampleRecords() {
  return useQuery(exampleRecordsQueryOptions());
}

export function useCreateExampleRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExampleRecord,
    mutationKey: [...exampleRecordKeys.all, "create"],
    onSuccess: async (record) => {
      const listQuery = exampleRecordsQueryOptions();

      queryClient.setQueryData<ExampleRecord[]>(listQuery.queryKey, (current = []) => [
        record,
        ...current.filter((item) => item.id !== record.id),
      ]);

      // Reconcile the immediate cache update with the server-owned list.
      // Source: https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations
      await queryClient.invalidateQueries({ queryKey: exampleRecordKeys.all });
    },
  });
}
