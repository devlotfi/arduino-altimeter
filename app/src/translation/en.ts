import type { AppTranslation } from "../types/app-translation";

export const EN: AppTranslation = {
  dashboard: "Dashboard",
  settings: "Settings",
  pressure: "Pressure",
  altitude: "Altitude",
  temperature: "Temperature",
  connect: "Connect",
  disconnect: "Disconnect",

  save: "Save",
  apiKey: "API key",
  apiKeyDescription:
    "The api key is used to get the QNH from OpenWeatherMap to compute altitude properly",
  qnhDescription:
    "QNH is the atmospheric pressure reduced to mean sea level, used in aviation to set an altimeter so it indicates altitude above sea level.",
  or: "Or",
  fetchFromApi: "Fetch from API",
  fetchFromApiDescription:
    "To make things easy its also possible to get the QNH from OpenWeatherMap using current location",
  altitudeUnit: "Altitude unit",
  temperatureUnit: "Temperature unit",
  language: "Language",

  apiKeySaved: "API key has been saved",
  qnhSet: "QNH has been set",
  errorQnh: "Error while getting QNH",
  usbDisconnected: "Usb disconnected",
  connectionError: "Connection error",
  permissionRequired: "Permission required",
  unknownError: "Unknown error",

  mustConnectArduinoQnh: "You must be connected to arduino to set QNH",
  mustConnectInternetQnh: "You must be connected to the internet to fetch QNH",
  mustHaveLocationQnh: "You must allow location access",
  mustHaveApiKeyQnh: "You must have an API key for OpenWeatherMap",
};
