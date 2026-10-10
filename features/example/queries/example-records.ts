import { queryOptions } from "@tanstack/react-query";

import { listExampleRecords } from "../services/example-records";

export const exampleRecordKeys = {
  all: ["example-records"] as const,
  list: () => [...exampleRecordKeys.all, "list"] as const,
};

// Keep the key and function reusable across client hooks and server prefetching.
// Source: https://tanstack.com/query/latest/docs/framework/react/guides/query-options
export function exampleRecordsQueryOptions() {
  return queryOptions({
    queryFn: listExampleRecords,
    queryKey: exampleRecordKeys.list(),
  });
}
