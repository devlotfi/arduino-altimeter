import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import {
  SerialContext,
  SerialContextInitialValue,
} from "../context/serial-context";
import { requireNativeModule } from "expo";
import { SerialPortModule } from "../../modules/serial-port";
import Toast from "react-native-toast-message";
import { faInfoCircle, faSave } from "@fortawesome/free-solid-svg-icons";
import { isCodedError } from "../types/coded-error";
import { Errors } from "../types/errors";
import { faUsb } from "@fortawesome/free-brands-svg-icons";
import { isDataPayload } from "../types/data-payload";
import { isQnhAckPayload } from "../types/qnh-ack-payload";
import { isSerialData, SerialData } from "../types/serial-data";
import { useTranslation } from "react-i18next";

const SerialPort = requireNativeModule<SerialPortModule>("SerialPortModule");

export default function SerialProvider({ children }: PropsWithChildren) {
  const { t, i18n } = useTranslation();
  const [isConnected, setIsConnected] = useState<boolean>(
    SerialContextInitialValue.isConnected
  );
  const [serialData, setSerialData] = useState<SerialData | null>(
    SerialContextInitialValue.serialData
  );

  useEffect(() => {
    const handler = (e: any) => {
      if (isDataPayload(e) && isSerialData(e.data)) {
        setSerialData(e.data);
        console.log(e);
      } else if (isDataPayload(e) && isQnhAckPayload(e.data)) {
        Toast.show({
          type: "success",
          props: {
            icon: faSave,
            text: t("qnhSet"),
          },
        });
      } else {
        console.log(e);
      }
    };
    SerialPort.addListener("onData", handler);
    return () => {
      SerialPort.removeListener("onData", handler);
    };
  }, [i18n.language]);
  useEffect(() => {
    const handler = (e: any) => {
      console.log(e);
      if (isCodedError(e)) {
        if (e.code === Errors.USB_DISCONNECTED) {
          setIsConnected(false);
          Toast.show({
            type: "error",
            props: {
              icon: faUsb,
              text: t("usbDisconnected"),
            },
          });
        }
      } else {
        Toast.show({
          type: "error",
          props: {
            icon: faUsb,
            text: t("unknownError"),
          },
        });
      }
    };
    SerialPort.addListener("onError", handler);
    return () => {
      SerialPort.removeListener("onError", handler);
    };
  }, [i18n.language]);

  const connect = useCallback(async () => {
    try {
      await SerialPort.connect();
      setIsConnected(true);
      console.log("connected");
    } catch (error) {
      console.log(error);
      if (isCodedError(error) && error.code === Errors.PERMISSION_REQUIRED) {
        Toast.show({
          type: "primary",
          props: {
            icon: faUsb,
            text: t("permissionRequired"),
          },
        });
      } else {
        Toast.show({
          type: "error",
          props: {
            icon: faInfoCircle,
            text: t("connectionError"),
          },
        });
      }
    }
  }, [i18n.language]);

  const disconnect = useCallback(async () => {
    await SerialPort.disconnect();
    setIsConnected(false);
    console.log("disconnected");
  }, []);

  const setQNH = useCallback(async (qnh: number) => {
    try {
      await SerialPort.setQNH(qnh);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <SerialContext.Provider
      value={{
        isConnected,
        serialData,
        connect,
        disconnect,
        setQNH,
      }}
    >
      {children}
    </SerialContext.Provider>
  );
}
