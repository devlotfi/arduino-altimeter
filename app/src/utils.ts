export function formatMeters(meters: number) {
  return `${meters.toFixed(2)} M`;
}

export function formatFeet(meters: number) {
  return `${(meters * 3.28084).toFixed(2)} Ft`;
}

export function formatCelsius(celsius: number) {
  return `${celsius.toFixed(2)} °C`;
}

export function formatKelvin(celsius: number) {
  return `${(celsius + 273.15).toFixed(2)} K`;
}

export function formatFahrenheit(celsius: number) {
  return `${((celsius * 9) / 5 + 32).toFixed(2)} °F`;
}
