import { ScrollView } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useQuery } from "@tanstack/react-query";
import { SecureStorageKeys } from "../types/secure-storage-keys";
import LoadingView from "../components/loading-view";
import ApiKeyCard from "../components/settings/api-key-card";
import LanguageCard from "../components/settings/language-card";
import AltitudeUnitCard from "../components/settings/altitude-unit-card";
import TemperatureUnitCard from "../components/settings/temperature-unit-card";
import QnhCard from "../components/settings/qnh-card";

export default function SettingsScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ["API_KEY"],
    queryFn: async () => {
      return await SecureStore.getItemAsync(SecureStorageKeys.API_KEY);
    },
  });

  if (isLoading) return <LoadingView></LoadingView>;

  return (
    <ScrollView
      style={{ padding: 12 }}
      contentContainerStyle={{ gap: 20, paddingBottom: 100 }}
    >
      <ApiKeyCard apiKey={data}></ApiKeyCard>
      <QnhCard apiKey={data}></QnhCard>
      <AltitudeUnitCard></AltitudeUnitCard>
      <TemperatureUnitCard></TemperatureUnitCard>
      <LanguageCard></LanguageCard>
    </ScrollView>
  );
}
