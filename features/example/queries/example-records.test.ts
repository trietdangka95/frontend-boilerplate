import { describe, expect, it } from "vitest";

import { exampleRecordKeys, exampleRecordsQueryOptions } from "./example-records";

describe("exampleRecordsQueryOptions", () => {
  it("keeps the typed list key and query function together for reuse", () => {
    const options = exampleRecordsQueryOptions();

    expect(options.queryKey).toEqual(exampleRecordKeys.list());
    expect(options.queryFn).toEqual(expect.any(Function));
  });
});
