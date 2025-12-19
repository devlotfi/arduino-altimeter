import { createContext } from "react";

interface SerialContextType {
  isConnected: boolean;
  qnh: number | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  setQNH: (value: number) => Promise<void>;
}

export const SerialContextInitialValue: SerialContextType = {
  isConnected: false,
  qnh: null,
  async connect() {},
  async disconnect() {},
  async setQNH() {},
};

export const SerialContext = createContext(SerialContextInitialValue);
