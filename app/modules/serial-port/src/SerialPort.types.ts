export type SerialDevice = {
  id: number;
  vendorId: number;
  productId: number;
  deviceName: string;
};

export interface SerialPortModuleEvents {
  [key: string]: any;
  onData: (e: { data: string }) => void;
  onError: (e: { error: string }) => void;
}

export interface SerialPortModuleInterface {
  // List connected devices
  listDevices(): Promise<SerialDevice[]>;

  // Connect to a device by ID and baud rate
  connect(): Promise<void>;

  // Disconnect the current connection
  disconnect(): Promise<void>;
}
