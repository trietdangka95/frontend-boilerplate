import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ExampleDashboard } from "@/features/example/components/ExampleDashboard";
import { exampleRecordsQueryOptions } from "@/features/example/queries/example-records";
import { getQueryClient } from "@/services/query/query-client";
import { isDemoAuthEnabled } from "@/features/auth/server/demo-mode";

export default async function ExamplesPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(exampleRecordsQueryOptions());

  // Hydrate prefetched Server Component data into the matching client query.
  // Source: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#prefetching-and-dehydrating-data
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExampleDashboard showDemoAuth={isDemoAuthEnabled()} />
    </HydrationBoundary>
  );
}
