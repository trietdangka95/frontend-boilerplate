import type { Instrumentation } from "next";
import { reportError } from "@/services/observability/report-error";

export const onRequestError: Instrumentation.onRequestError = (error) => {
  reportError(error, "server");
};
