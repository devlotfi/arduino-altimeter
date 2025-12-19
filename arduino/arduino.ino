#include <Wire.h>
#include <Adafruit_BMP280.h>
#include <ArduinoJson.h>

Adafruit_BMP280 bmp;

float QNH = 1013.25;

unsigned long lastRead = 0;
const unsigned long readInterval = 2000;

// ---------------- SERIAL COMMAND HANDLER ----------------
void handleSerialCommand(String jsonString) {
  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, jsonString);

  if (error) {
    return;
  }

  const char* command = doc["command"];
  if (!command) return;

  // SET_QNH command
  if (strcmp(command, "SET_QNH") == 0) {
    if (doc["params"]["qnh"]) {
      QNH = doc["params"]["qnh"].as<float>();

      // Send ACK
      StaticJsonDocument<128> response;
      response["status"] = "OK";
      response["qnh"] = QNH;

      serializeJson(response, Serial);
      Serial.println();
    }
  }
}

// ---------------- SETUP ----------------
void setup() {
  Serial.begin(9600);

  if (!bmp.begin(0x76)) {
    while (1);
  }

  // High precision mode
  bmp.setSampling(
    Adafruit_BMP280::MODE_NORMAL,
    Adafruit_BMP280::SAMPLING_X16,
    Adafruit_BMP280::SAMPLING_X16,
    Adafruit_BMP280::FILTER_X16,
    Adafruit_BMP280::STANDBY_MS_1000
  );

  delay(2000);
}

// ---------------- LOOP ----------------
void loop() {
  // Read incoming JSON commands
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    handleSerialCommand(input);
  }

  // Periodic sensor output
  if (millis() - lastRead >= readInterval) {
    lastRead = millis();

    float temp = 0;
    float pressure = 0;
    float altitude = 0;

    const int samples = 5;
    for (int i = 0; i < samples; i++) {
      temp += bmp.readTemperature();
      pressure += bmp.readPressure();
      altitude += bmp.readAltitude(QNH);
      delay(50);
    }

    temp /= samples;
    pressure /= samples;
    altitude /= samples;

    // Build JSON output
    StaticJsonDocument<256> doc;
    doc["temperature_c"] = temp;
    doc["pressure_hpa"] = pressure / 100.0;
    doc["altitude_m"] = altitude;
    doc["qnh"] = QNH;

    serializeJson(doc, Serial);
    Serial.println();
  }
}
