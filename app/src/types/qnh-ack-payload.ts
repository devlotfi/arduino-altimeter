export interface QnhAckPayload {
  status: "OK";
  qnh: number;
}

export function isQnhAckPayload(object: unknown): object is QnhAckPayload {
  return (
    typeof object === "object" &&
    object !== null &&
    "status" in object &&
    typeof (object as any).status === "string" &&
    object.status === "OK" &&
    "qnh" in object &&
    typeof (object as any).qnh === "number"
  );
}
