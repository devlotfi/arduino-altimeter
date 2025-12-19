import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import {
  SerialContext,
  SerialContextInitialValue,
} from "../context/serial-context";
import { requireNativeModule } from "expo";
import { SerialPortModule } from "../../modules/serial-port";
import Toast from "react-native-toast-message";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { CodedError, isCodedError } from "../types/coded-error";
import { Errors } from "../types/errors";
import { faUsb } from "@fortawesome/free-brands-svg-icons";

const SerialPort = requireNativeModule<SerialPortModule>("SerialPortModule");

export default function SerialProvider({ children }: PropsWithChildren) {
  const [isConnected, setIsConnected] = useState<boolean>(
    SerialContextInitialValue.isConnected
  );
  const [qnh, setQNHState] = useState<number | null>(
    SerialContextInitialValue.qnh
  );

  useEffect(() => {
    const handler = (e: any) => {
      console.log(e);
    };
    SerialPort.addListener("onData", handler);
    return () => {
      SerialPort.removeListener("onData", handler);
    };
  }, []);

  const connect = useCallback(async () => {
    try {
      await SerialPort.connect();
      console.log("connected");
    } catch (error) {
      console.error(error);
      if (isCodedError(error) && error.code === Errors.PERMISSION_REQUIRED) {
        Toast.show({
          type: "primary",
          props: {
            icon: faUsb,
            text: "Permission required",
          },
        });
      } else {
        Toast.show({
          type: "error",
          props: {
            icon: faInfoCircle,
            text: "Connection error",
          },
        });
      }
    }
  }, []);

  const disconnect = useCallback(async () => {
    await SerialPort.disconnect();
    console.log("disconnected");
  }, []);

  const setQNH = useCallback(async (value: number) => {}, []);

  return (
    <SerialContext.Provider
      value={{
        isConnected,
        qnh,
        connect,
        disconnect,
        setQNH,
      }}
    >
      {children}
    </SerialContext.Provider>
  );
}
