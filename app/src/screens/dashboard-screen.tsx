import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import Text from "../components/text";
import { ActivityIndicator, Button, useTheme } from "react-native-paper";
import { PropsWithChildren, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  faMountain,
  faPlugCircleXmark,
  faTemperatureHalf,
} from "@fortawesome/free-solid-svg-icons";
import { faUsb } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { SerialContext } from "../context/serial-context";
import { useMutation } from "@tanstack/react-query";
import { SettingsContext } from "../context/settings-context";
import {
  formatCelsius,
  formatFahrenheit,
  formatFeet,
  formatKelvin,
  formatMeters,
} from "../utils";
import { useTranslation } from "react-i18next";

function MetricCard({ children }: PropsWithChildren) {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={[theme.colors.surface, theme.colors.background]}
      style={{
        padding: 5,
        borderRadius: 17,
        flex: 1,
      }}
    >
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 7,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        {children}
      </LinearGradient>
    </LinearGradient>
  );
}

function MetricGauge({ children, style, ...props }: ViewProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        padding: 10,
        borderColor: theme.colors.primary,
        borderWidth: 2,
        borderRadius: 1000,
        ...StyleSheet.flatten(style),
      }}
      {...props}
    >
      <LinearGradient
        colors={[theme.colors.surface, theme.colors.background]}
        style={{
          padding: 5,
          borderRadius: 1000,
        }}
      >
        <LinearGradient
          colors={[theme.colors.background, theme.colors.surface]}
          style={{
            height: 150,
            width: 150,
            padding: 10,
            borderRadius: 1000,
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
          }}
        >
          {children}
        </LinearGradient>
      </LinearGradient>
    </View>
  );
}

export default function DashboardScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { altitudeUnit, temperatureUnit } = useContext(SettingsContext);
  const { isConnected, serialData, connect, disconnect } =
    useContext(SerialContext);

  const { mutate: mutateConnect, isPending: isPendingConnect } = useMutation({
    mutationFn: async () => {
      await connect();
    },
  });
  const { mutate: mutateDisconnect, isPending: isPendingDisconnect } =
    useMutation({
      mutationFn: async () => {
        await disconnect();
      },
    });

  if (!isConnected) {
    return (
      <ScrollView contentContainerStyle={{ padding: 12, flex: 1 }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 20,
          }}
        >
          <Pressable onPress={() => mutateConnect()}>
            <MetricGauge
              style={{ borderStyle: "dashed", borderColor: "#39CE8E" }}
            >
              {isPendingConnect ? (
                <ActivityIndicator
                  size="large"
                  color="#39CE8E"
                ></ActivityIndicator>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faUsb}
                    size={30}
                    color="#39CE8E"
                    style={{ opacity: 0.8 }}
                  ></FontAwesomeIcon>
                  <Text style={{ fontSize: 23, fontWeight: "bold" }}>
                    {t("connect")}
                  </Text>
                </>
              )}
            </MetricGauge>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 12, flex: 1 }}>
      <Button
        mode="contained"
        textColor={theme.colors.errorContainer}
        contentStyle={{ paddingVertical: 5 }}
        style={{
          marginBottom: 12,
          borderRadius: 17,
          backgroundColor: theme.colors.surface,
        }}
        loading={isPendingDisconnect}
        icon={({ size, color }) => (
          <FontAwesomeIcon
            icon={faPlugCircleXmark}
            size={size}
            color={color}
          ></FontAwesomeIcon>
        )}
        onPress={() => mutateDisconnect()}
      >
        {t("disconnect")}
      </Button>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
        }}
      >
        <MetricCard>
          <Text style={{ fontSize: 13 }}>{t("pressure")}</Text>
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>
            {serialData?.pressure_hpa.toFixed(2)} hpa
          </Text>
        </MetricCard>
        <MetricCard>
          <Text style={{ fontSize: 13 }}>QNH</Text>
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>
            {serialData?.qnh.toFixed(2)}
          </Text>
        </MetricCard>
      </View>

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          gap: 20,
        }}
      >
        <MetricGauge>
          <FontAwesomeIcon
            icon={faMountain}
            size={30}
            color={theme.colors.primary}
            style={{ opacity: 0.8 }}
          ></FontAwesomeIcon>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            {serialData
              ? altitudeUnit === "FT"
                ? formatFeet(serialData.altitude_m)
                : formatMeters(serialData.altitude_m)
              : null}
          </Text>
          <Text>{t("altitude")}</Text>
        </MetricGauge>

        <MetricGauge style={{ borderStyle: "dashed" }}>
          <FontAwesomeIcon
            icon={faTemperatureHalf}
            size={30}
            color={theme.colors.primary}
            style={{ opacity: 0.8 }}
          ></FontAwesomeIcon>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            {serialData
              ? temperatureUnit === "F"
                ? formatFahrenheit(serialData.temperature_c)
                : temperatureUnit === "K"
                ? formatKelvin(serialData.temperature_c)
                : formatCelsius(serialData.temperature_c)
              : null}
          </Text>
          <Text>{t("temperature")}</Text>
        </MetricGauge>
      </View>
    </ScrollView>
  );
}
