import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import Text from "../components/text";
import { Button, useTheme } from "react-native-paper";
import { PropsWithChildren, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { faThermometer } from "@fortawesome/free-solid-svg-icons";
import { faUsb } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { SerialContext } from "../context/serial-context";

function MetricCard({ children }: PropsWithChildren) {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={[theme.colors.surface, theme.colors.background]}
      style={{
        padding: 5,
        borderRadius: 1000,
        flex: 1,
      }}
    >
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={{
          padding: 10,
          borderRadius: 1000,
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
  const theme = useTheme();
  const { isConnected, connect, disconnect } = useContext(SerialContext);

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
          <Button onPress={async () => await disconnect()}>disconnect</Button>
          <Pressable onPress={async () => await connect()}>
            <MetricGauge
              style={{ borderStyle: "dashed", borderColor: "#39CE8E" }}
            >
              <FontAwesomeIcon
                icon={faUsb}
                size={30}
                color="#39CE8E"
                style={{ opacity: 0.8 }}
              ></FontAwesomeIcon>
              <Text style={{ fontSize: 23, fontWeight: "bold" }}>Connect</Text>
            </MetricGauge>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 12, flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
        }}
      >
        <MetricCard>
          <Text>lol</Text>
        </MetricCard>
        <MetricCard>
          <Text>lol</Text>
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
            icon={faThermometer}
            size={30}
            color={theme.colors.primary}
            style={{ opacity: 0.8 }}
          ></FontAwesomeIcon>
          <Text style={{ fontSize: 23, fontWeight: "bold" }}>20 C</Text>
          <Text>Temperature</Text>
        </MetricGauge>
      </View>
    </ScrollView>
  );
}
