export interface SerialData {
  temperature_c: number;
  pressure_hpa: number;
  altitude_m: number;
  qnh: number;
}

export function isSerialData(object: unknown): object is SerialData {
  return (
    typeof object === "object" &&
    object !== null &&
    "temperature_c" in object &&
    typeof (object as any).temperature_c === "number" &&
    "pressure_hpa" in object &&
    typeof (object as any).pressure_hpa === "number" &&
    "altitude_m" in object &&
    typeof (object as any).altitude_m === "number" &&
    "qnh" in object &&
    typeof (object as any).qnh === "number"
  );
}
