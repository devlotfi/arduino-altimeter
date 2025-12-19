import { View } from "react-native";
import Text from "../text";
import { Button, Card, useTheme } from "react-native-paper";
import { useContext } from "react";
import {
  SettingsContext,
  TemperatureUnit,
} from "../../context/settings-context";
import { useTranslation } from "react-i18next";

function UnitButton({ name, unit }: { name: string; unit: TemperatureUnit }) {
  const theme = useTheme();
  const { temperatureUnit, setTemperatureUnit } = useContext(SettingsContext);

  return (
    <Button
      mode="contained"
      textColor={theme.colors.onBackground}
      contentStyle={{
        paddingVertical: 5,
      }}
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
      onPress={() => setTemperatureUnit(unit)}
    >
      <Text
        style={{
          color:
            temperatureUnit === unit
              ? theme.colors.primary
              : theme.colors.onBackground,
          fontWeight: temperatureUnit === unit ? "bold" : "medium",
          fontSize: 20,
        }}
      >
        {name}
      </Text>
    </Button>
  );
}

export default function TemperatureUnitCard() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Card
      mode="contained"
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
      }}
    >
      <Card.Content style={{ gap: 10 }}>
        <Text style={{ fontSize: 23, fontWeight: "bold" }}>
          {t("temperatureUnit")}
        </Text>
        <View style={{ gap: 5, flexDirection: "row" }}>
          <UnitButton name="°C" unit="C"></UnitButton>
          <UnitButton name="°F" unit="F"></UnitButton>
          <UnitButton name="K" unit="K"></UnitButton>
        </View>
      </Card.Content>
    </Card>
  );
}
