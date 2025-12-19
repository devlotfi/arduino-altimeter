import { PropsWithChildren, useCallback } from "react";
import {
  AltitudeUnit,
  SettingsContext,
  SettingsContextInitialValue,
  TemperatureUnit,
} from "../context/settings-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocales } from "expo-localization";
import LoadingView from "../components/loading-view";

export default function SettingsProvider({ children }: PropsWithChildren) {
  const locales = useLocales();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["SETTINGS"],
    queryFn: async () => {
      const [altitideUnit, temperatureUnit] = await Promise.all([
        AsyncStorage.getItem("ALTITUDE_UNIT"),
        AsyncStorage.getItem("TEMPERATURE_UNIT"),
      ]);
      return {
        altitudeUnit: altitideUnit as AltitudeUnit,
        temperatureUnit: temperatureUnit as TemperatureUnit,
      };
    },
  });

  const setAltitudeUnit = useCallback(async (value: AltitudeUnit) => {
    await AsyncStorage.setItem("ALTITUDE_UNIT", value);
    queryClient.refetchQueries({
      queryKey: ["SETTINGS"],
    });
  }, []);
  const setTemperatureUnit = useCallback(async (value: TemperatureUnit) => {
    await AsyncStorage.setItem("TEMPERATURE_UNIT", value);
    queryClient.refetchQueries({
      queryKey: ["SETTINGS"],
    });
  }, []);

  if (isLoading || !data) return <LoadingView></LoadingView>;

  const locale = locales.length > 0 ? locales[0] : null;

  return (
    <SettingsContext.Provider
      value={{
        altitudeUnit:
          data.altitudeUnit ??
          (locale
            ? locale.measurementSystem === "metric"
              ? "M"
              : "FT"
            : SettingsContextInitialValue.altitudeUnit),
        setAltitudeUnit,
        temperatureUnit:
          data.temperatureUnit ??
          (locale
            ? locale.temperatureUnit === "celsius"
              ? "C"
              : "F"
            : SettingsContextInitialValue.altitudeUnit),
        setTemperatureUnit,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
