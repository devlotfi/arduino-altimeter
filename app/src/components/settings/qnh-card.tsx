import Text from "../text";
import { Button, Card, useTheme } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as yup from "yup";
import ValidatedTextInput from "../validated-text-input";
import Toast from "react-native-toast-message";
import {
  faGlobe,
  faInfoCircle,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { SerialContext } from "../../context/serial-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { View } from "react-native";
import * as Location from "expo-location";
import * as Network from "expo-network";
import axios from "axios";
import { OptionalNullable } from "../../types/optional-nullable";
import { OpenWeatherMapApiResponse } from "../../types/api-response";
import { useTranslation } from "react-i18next";

export default function QnhCard({
  apiKey,
}: {
  apiKey: OptionalNullable<string>;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { isConnected, setQNH } = useContext(SerialContext);
  const { isInternetReachable } = Network.useNetworkState();
  const [status, requestPermission] = Location.useForegroundPermissions();

  const { mutate: mutateSetQnh, isPending: isPendingSetQnh } = useMutation({
    mutationFn: async (qnh: number) => {
      await setQNH(qnh);
    },
  });

  const { mutate: mutateFetchQnh, isPending: isPendingFetchQnh } = useMutation({
    mutationFn: async () => {
      try {
        if (!status || !status.granted) {
          await requestPermission();
        }
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });
        console.log(position);
        const response = await axios.get<OpenWeatherMapApiResponse>(
          "https://api.openweathermap.org/data/2.5/weather",
          {
            params: {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              appid: apiKey,
            },
          }
        );
        console.log(response.data);
        await setQNH(response.data.main.sea_level);
      } catch (error) {
        console.log(error);
        Toast.show({
          type: "error",
          props: {
            icon: faInfoCircle,
            text: t("errorQnh"),
          },
        });
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      qnh: "",
    },
    validationSchema: yup.object({
      qnh: yup
        .number()
        .min(800)
        .max(1100)
        .typeError("Must be a number")
        .required(),
    }),
    onSubmit(values) {
      mutateSetQnh(Number(values.qnh));
    },
  });

  return (
    <Card
      mode="contained"
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
      }}
    >
      <Card.Content style={{ gap: 10 }}>
        <Text style={{ fontSize: 23, fontWeight: "bold" }}>QNH</Text>
        <Text style={{ fontSize: 16, fontWeight: "medium", opacity: 0.7 }}>
          {t("qnhDescription")}
        </Text>
        {!isConnected ? (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "medium",
              color: "#CFAF2E",
            }}
          >
            {t("mustConnectArduinoQnh")}
          </Text>
        ) : null}
        <ValidatedTextInput
          name="qnh"
          inputMode="numeric"
          formik={formik}
          mode="outlined"
          outlineStyle={{
            borderRadius: 10,
          }}
          disabled={!isConnected}
          autoCapitalize="none"
          label="QNH"
        ></ValidatedTextInput>
        <Button
          mode="contained"
          loading={isPendingSetQnh}
          contentStyle={{ paddingVertical: 5 }}
          disabled={!isConnected}
          icon={({ size, color }) => (
            <FontAwesomeIcon
              icon={faSave}
              size={size}
              color={color}
            ></FontAwesomeIcon>
          )}
          onPress={() => formik.handleSubmit()}
        >
          {t("save")}
        </Button>
        <View style={{ alignItems: "center", flexDirection: "row", gap: 10 }}>
          <View
            style={{
              height: 1,
              flex: 1,

              backgroundColor: theme.colors.outline,
            }}
          ></View>
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>{t("or")}</Text>
          <View
            style={{
              height: 1,
              flex: 1,

              backgroundColor: theme.colors.outline,
            }}
          ></View>
        </View>

        <Text style={{ fontSize: 16, fontWeight: "medium", opacity: 0.7 }}>
          {t("fetchFromApiDescription")}
        </Text>

        {!isConnected ? (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "medium",
              color: "#CFAF2E",
            }}
          >
            {t("mustConnectArduinoQnh")}
          </Text>
        ) : null}
        {!isInternetReachable ? (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "medium",
              color: "#CFAF2E",
            }}
          >
            {t("mustConnectInternetQnh")}
          </Text>
        ) : null}
        {!status || !status.granted ? (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "medium",
              color: "#CFAF2E",
            }}
          >
            {t("mustHaveLocationQnh")}
          </Text>
        ) : null}
        {!apiKey ? (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "medium",
              color: "#CFAF2E",
            }}
          >
            {t("mustHaveApiKeyQnh")}
          </Text>
        ) : null}

        <Button
          mode="contained"
          loading={isPendingFetchQnh}
          contentStyle={{ paddingVertical: 5 }}
          disabled={!isInternetReachable || !isConnected || !apiKey}
          icon={({ size, color }) => (
            <FontAwesomeIcon
              icon={faGlobe}
              size={size}
              color={color}
            ></FontAwesomeIcon>
          )}
          onPress={() => mutateFetchQnh()}
        >
          {t("fetchFromApi")}
        </Button>
      </Card.Content>
    </Card>
  );
}
