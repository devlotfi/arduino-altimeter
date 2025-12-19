import { SerialData } from "./serial-data";

export interface DataPayload {
  data: SerialData;
}

export function isDataPayload(object: unknown): object is DataPayload {
  return (
    typeof object === "object" &&
    object !== null &&
    "data" in object &&
    typeof (object as any).data === "object" &&
    object.data !== null
  );
}
