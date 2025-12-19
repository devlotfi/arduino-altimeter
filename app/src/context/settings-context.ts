import { createContext } from "react";

export type AltitudeUnit = "M" | "FT";
export type TemperatureUnit = "C" | "F" | "K";

interface SettingsContextType {
  altitudeUnit: AltitudeUnit;
  setAltitudeUnit: (value: AltitudeUnit) => Promise<void>;
  temperatureUnit: TemperatureUnit;
  setTemperatureUnit: (value: TemperatureUnit) => Promise<void>;
}

export const SettingsContextInitialValue: SettingsContextType = {
  altitudeUnit: "M",
  async setAltitudeUnit() {},
  temperatureUnit: "C",
  async setTemperatureUnit() {},
};

export const SettingsContext = createContext(SettingsContextInitialValue);
