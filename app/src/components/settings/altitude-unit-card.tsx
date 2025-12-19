import { View } from "react-native";
import Text from "../text";
import { Button, Card, useTheme } from "react-native-paper";
import { useContext } from "react";
import { AltitudeUnit, SettingsContext } from "../../context/settings-context";
import { useTranslation } from "react-i18next";

function UnitButton({ name, unit }: { name: string; unit: AltitudeUnit }) {
  const theme = useTheme();
  const { altitudeUnit, setAltitudeUnit } = useContext(SettingsContext);

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
      onPress={() => setAltitudeUnit(unit)}
    >
      <Text
        style={{
          color:
            altitudeUnit === unit
              ? theme.colors.primary
              : theme.colors.onBackground,
          fontWeight: altitudeUnit === unit ? "bold" : "medium",
          fontSize: 20,
        }}
      >
        {name}
      </Text>
    </Button>
  );
}

export default function AltitudeUnitCard() {
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
          {t("altitudeUnit")}
        </Text>
        <View style={{ gap: 5, flexDirection: "row" }}>
          <UnitButton name="M" unit="M"></UnitButton>
          <UnitButton name="Ft" unit="FT"></UnitButton>
        </View>
      </Card.Content>
    </Card>
  );
}
