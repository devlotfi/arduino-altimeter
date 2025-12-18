// Reexport the native module. On web, it will be resolved to SerialPortModule.web.ts
// and on native platforms to SerialPortModule.ts
export { default, SerialPortModule } from "./src/SerialPortModule";
export * from "./src/SerialPort.types";
