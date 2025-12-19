import { NativeModule, requireNativeModule } from "expo";
import { type SerialPortModuleEvents, SerialDevice } from "./SerialPort.types";

export declare class SerialPortModule extends NativeModule<SerialPortModuleEvents> {
  listDevices(): Promise<SerialDevice[]>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  setQNH(qnh: number): Promise<void>;
}

// Load the native module using JSI
const SerialPort = requireNativeModule<SerialPortModule>("SerialPort");

export default SerialPort;
