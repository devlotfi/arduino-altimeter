import { createContext } from "react";
import { SerialData } from "../types/serial-data";

interface SerialContextType {
  isConnected: boolean;
  serialData: SerialData | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  setQNH: (value: number) => Promise<void>;
}

export const SerialContextInitialValue: SerialContextType = {
  isConnected: false,
  serialData: null,
  async connect() {},
  async disconnect() {},
  async setQNH() {},
};

export const SerialContext = createContext(SerialContextInitialValue);
