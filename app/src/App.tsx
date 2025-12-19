import "./i18n";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { KeyboardAvoidingView, useColorScheme, View } from "react-native";
import { darkTheme, lightTheme } from "./types/themes";
import { BottomNavigation, PaperProvider, useTheme } from "react-native-paper";
import AssetsProvider from "./provider/assets-provider";
import { KeyboardProvider } from "./provider/keyboard-provider";
import * as SystemUI from "expo-system-ui";
import { CommonActions, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomTabsParamList } from "./types/navigation-types";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGauge, faGear } from "@fortawesome/free-solid-svg-icons";
import DashboardScreen from "./screens/dashboard-screen";
import SettingsScreen from "./screens/settings-screen";
import TitleBar from "./components/title-bar";
import PageLayout from "./layout/page-layout";
import { useTranslation } from "react-i18next";
import { KeyboardContext } from "./context/keyboard-context";
import SerialProvider from "./provider/serial-provider";
import Toast from "react-native-toast-message";
import { toastConfig } from "./toast-config";

const BottomTabs = createBottomTabNavigator<BottomTabsParamList>();

function BottomTabsComponent() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <BottomTabs.Navigator
        screenOptions={{
          animation: "shift",
          sceneStyle: {
            backgroundColor: theme.colors.surface,
          },
          header: () => {
            return <TitleBar></TitleBar>;
          },
        }}
        tabBar={({ navigation, state, descriptors, insets }) => (
          <BottomNavigation.Bar
            style={{
              backgroundColor: theme.colors.surface,
            }}
            activeIndicatorStyle={{
              backgroundColor: theme.colors.primary,
            }}
            navigationState={state}
            safeAreaInsets={insets}
            onTabPress={({ route, preventDefault }) => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (event.defaultPrevented) {
                preventDefault();
              } else {
                navigation.dispatch({
                  ...CommonActions.navigate(route.name, route.params),
                  target: state.key,
                });
              }
            }}
            renderIcon={({ route, focused, color }) => {
              const { options } = descriptors[route.key];
              if (options.tabBarIcon) {
                return options.tabBarIcon({
                  focused,
                  color: focused ? "#ffffff" : theme.colors.onBackground,
                  size: 22,
                });
              }

              return null;
            }}
            getLabelText={({ route }) => {
              const { options } = descriptors[route.key];
              return options.tabBarLabel as string;
            }}
          />
        )}
      >
        <BottomTabs.Screen
          name="Dashboard"
          component={DashboardScreen}
          layout={({ children }) => <PageLayout>{children}</PageLayout>}
          options={{
            tabBarLabel: t("dashboard"),
            tabBarIcon: ({ color, size }) => {
              return (
                <FontAwesomeIcon icon={faGauge} size={size} color={color} />
              );
            },
          }}
        />
        <BottomTabs.Screen
          name="Settings"
          component={SettingsScreen}
          layout={({ children }) => <PageLayout>{children}</PageLayout>}
          options={{
            tabBarLabel: t("settings"),
            tabBarIcon: ({ color, size }) => {
              return (
                <FontAwesomeIcon icon={faGear} size={size} color={color} />
              );
            },
          }}
        />
      </BottomTabs.Navigator>
    </View>
  );
}

function App() {
  const theme = useTheme();
  const { isKeyboardVisible } = useContext(KeyboardContext);

  useEffect(() => {
    (async () => {
      await SystemUI.setBackgroundColorAsync(theme.colors.background);
    })();
  }, [theme]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="height"
      enabled={isKeyboardVisible}
    >
      <NavigationContainer>
        <BottomTabsComponent></BottomTabsComponent>
      </NavigationContainer>
    </KeyboardAvoidingView>
  );
}

const queryClient = new QueryClient();

export default function Providers() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={colorScheme === "light" ? lightTheme : darkTheme}>
        <AssetsProvider>
          <KeyboardProvider>
            <SerialProvider>
              <App></App>
              <Toast config={toastConfig}></Toast>
              <StatusBar
                translucent={true}
                style={colorScheme === "light" ? "dark" : "light"}
              ></StatusBar>
            </SerialProvider>
          </KeyboardProvider>
        </AssetsProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
