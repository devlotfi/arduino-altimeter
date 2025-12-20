<img src="https://raw.githubusercontent.com/devlotfi/arduino-altimeter/master/github-assets/github-banner.png">

# 📜 arduino-altimeter

THe goal of this project is to create a an altitude sensor system for phones that do not have a barometric sensor

# 📌 Contents

- [Tech stack](#tech-stack)
  - [Web app](#web-app)
  - [IOT](#iot)
  - [Diagrams](#diagrams)
- [How does the system work ?](#how-does-the-system-work-)
- [Building the altitude sensor](#building-the-altitude-sensor)
  - [Components](#components)
  - [Configuration](#configuration)
  - [Images](#images)
- [Android App](#android-app)

# Tech stack

## Web app

<p float="left">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/ts.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/reactnative.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/expo.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/fontawesome.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/formik.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/i18n.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/react-native-paper.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/openweathermap.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/reactnavigation.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/tanstack-query.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/maplibre.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/maptiler.svg">
</p>

## IOT

<p float="left">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/arduino.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/mqtt.svg">
</p>

## Diagrams

<p float="left">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/drawio.svg">
  <img height="50px" src="https://devlotfi.github.io/stack-icons/icons/fritzing.svg">
</p>

# How does the system work ?

- The arduino is connected to BMP280 and sends readings periodicly
- The app recieves the data via serial connection and displays it
- The app can can fetch the QNH using OpenWeatherMap and the current location
- The can then send the QNH to be set in the arduino

<img src="https://raw.githubusercontent.com/devlotfi/arduino-altimeter/master/github-assets/working-diagram.png">

# Building the Altitude Sensor

## Components

- Arduino Nano
- BMP280
- Case (Optional)

<img src="https://raw.githubusercontent.com/devlotfi/arduino-altimeter/master/github-assets/fritzing.png">

## Configuration

You can change this part of the arduino [script](https://github.com/devlotfi/arduino-altimeter/blob/master/arduino/arduino.ino) to match your needs

```ino
bmp.setSampling(
    Adafruit_BMP280::MODE_NORMAL,
    Adafruit_BMP280::SAMPLING_X16,
    Adafruit_BMP280::SAMPLING_X16,
    Adafruit_BMP280::FILTER_X16,
    Adafruit_BMP280::STANDBY_MS_1000
);
```

## Images

Some images of the final build

<img src="https://raw.githubusercontent.com/devlotfi/arduino-altimeter/master/github-assets/build.jpg">

# Android App

<img src="https://raw.githubusercontent.com/devlotfi/arduino-altimeter/master/github-assets/preview-1.png">
<img src="https://raw.githubusercontent.com/devlotfi/arduino-altimeter/master/github-assets/preview-2.png">
