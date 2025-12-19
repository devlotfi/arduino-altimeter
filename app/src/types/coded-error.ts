import { Errors } from "./errors";

export interface CodedError {
  code: Errors;
}

export function isCodedError(error: unknown): error is CodedError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as any).code === "string"
  );
}
