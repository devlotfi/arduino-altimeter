import type { AppTranslation } from "../types/app-translation";

export const FR: AppTranslation = {
  dashboard: "Tableau de bord",
  settings: "Paramètres",
  pressure: "Pression",
  altitude: "Altitude",
  temperature: "Température",
  connect: "Connecter",
  disconnect: "Déconnecter",

  save: "Enregistrer",
  apiKey: "Clé API",
  apiKeyDescription:
    "La clé API est utilisée pour obtenir le QNH depuis OpenWeatherMap afin de calculer correctement l'altitude",
  qnhDescription:
    "Le QNH est la pression atmosphérique ramenée au niveau moyen de la mer, utilisée en aviation pour régler un altimètre afin qu'il indique l'altitude au-dessus du niveau de la mer.",
  or: "Ou",
  fetchFromApi: "Récupérer depuis l'API",
  fetchFromApiDescription:
    "Pour simplifier, il est également possible d'obtenir le QNH depuis OpenWeatherMap en utilisant la position actuelle",
  altitudeUnit: "Unité d'altitude",
  temperatureUnit: "Unité de température",
  language: "Langue",

  apiKeySaved: "La clé API a été enregistrée",
  qnhSet: "Le QNH a été défini",
  errorQnh: "Erreur lors de l'obtention du QNH",
  usbDisconnected: "USB déconnecté",
  connectionError: "Erreur de connexion",
  permissionRequired: "Permission requise",
  unknownError: "Erreur inconnue",

  mustConnectArduinoQnh:
    "Vous devez être connecté à l'Arduino pour définir le QNH",
  mustConnectInternetQnh:
    "Vous devez être connecté à Internet pour récupérer le QNH",
  mustHaveLocationQnh: "Vous devez autoriser l'accès à la localisation",
  mustHaveApiKeyQnh: "Vous devez disposer d'une clé API pour OpenWeatherMap",
};
