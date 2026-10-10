// @vitest-environment node

import { describe, expect, it } from "vitest";

import manifest from "./manifest";
import sitemap from "./sitemap";

describe("public metadata routes", () => {
  it("publishes the application icon in the web manifest", () => {
    expect(manifest().icons).toContainEqual(
      expect.objectContaining({
        sizes: "any",
        src: "/icon.svg",
        type: "image/svg+xml",
      }),
    );
  });

  it("keeps noindex authentication screens out of the sitemap", () => {
    expect(sitemap().map(({ url }) => url)).toEqual(["http://localhost:3000"]);
  });
});
