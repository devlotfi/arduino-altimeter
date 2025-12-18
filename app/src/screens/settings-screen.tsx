import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import Text from "../components/text";
import { ActivityIndicator, Button, Card, useTheme } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import {
  useIsFetching,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { SecureStorageKeys } from "../types/secure-storage-keys";
import { useFormik } from "formik";
import * as yup from "yup";
import ValidatedTextInput from "../components/validated-text-input";
import { OptionalNullable } from "../types/optional-nullable";
import LoadingView from "../components/loading-view";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AssetsContext } from "../context/assets-context";
import { Image } from "expo-image";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

function ApiKeyCard({ apiKey }: { apiKey: OptionalNullable<string> }) {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (apiKey: string) => {
      await SecureStore.setItemAsync(SecureStorageKeys.API_KEY, apiKey);
      queryClient.resetQueries({
        queryKey: ["API_KEY"],
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      apiKey: apiKey || "",
    },
    validationSchema: yup.object({
      apiKey: yup.string().required(),
    }),
    onSubmit(values) {
      mutate(values.apiKey);
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
        <Text style={{ fontSize: 23, fontWeight: "bold" }}>API key</Text>
        <Text style={{ fontSize: 16, fontWeight: "medium", opacity: 0.7 }}>
          The api key is used to get the QNH from OpenWeatherMap to compute
          altitude properly
        </Text>
        <ValidatedTextInput
          name="apiKey"
          formik={formik}
          mode="outlined"
          outlineStyle={{
            borderRadius: 10,
          }}
          secureTextEntry
          autoCapitalize="none"
          label="API key"
        ></ValidatedTextInput>
        <Button
          mode="contained"
          loading={isPending}
          contentStyle={{ paddingVertical: 5 }}
          onPress={() => formik.handleSubmit()}
        >
          Save
        </Button>
      </Card.Content>
    </Card>
  );
}

function LanguageButton({
  name,
  language,
}: {
  name: string;
  language: string;
}) {
  const { i18n } = useTranslation();
  const theme = useTheme();

  return (
    <Button
      mode="contained"
      textColor={theme.colors.onBackground}
      contentStyle={{
        paddingVertical: 5,
        justifyContent: "flex-start",
      }}
      style={{
        backgroundColor: theme.colors.background,
      }}
      onPress={() => {
        i18n.changeLanguage(language);
      }}
    >
      <Text
        style={{
          color:
            i18n.language === language
              ? theme.colors.primary
              : theme.colors.onBackground,
          fontWeight: i18n.language === language ? "bold" : "medium",
        }}
      >
        {name}
      </Text>
    </Button>
  );
}

function LanguageCard() {
  const theme = useTheme();
  const { assets } = useContext(AssetsContext);
  const { t, i18n } = useTranslation();

  return (
    <Card
      mode="contained"
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
      }}
    >
      <Card.Content style={{ gap: 10 }}>
        <Text style={{ fontSize: 23, fontWeight: "bold" }}>Language</Text>
        <View style={{ gap: 5 }}>
          <LanguageButton name="العربية" language="ar"></LanguageButton>
          <LanguageButton name="Français" language="fr"></LanguageButton>
          <LanguageButton name="English" language="en"></LanguageButton>
        </View>
      </Card.Content>
    </Card>
  );
}

export default function SettingsScreen() {
  const theme = useTheme();

  const { data, isLoading } = useQuery({
    queryKey: ["API_KEY"],
    queryFn: async () => {
      return await SecureStore.getItemAsync(SecureStorageKeys.API_KEY);
    },
  });

  if (isLoading) return <LoadingView></LoadingView>;

  return (
    <ScrollView style={{ padding: 12 }} contentContainerStyle={{ gap: 12 }}>
      <ApiKeyCard apiKey={data}></ApiKeyCard>
      <LanguageCard></LanguageCard>
    </ScrollView>
  );
}
