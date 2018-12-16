# Thingy Security Camera Addon

## Description

This simple application is used to take and send snapshots for the Thingy Security Project.

## Requirements

- node.js
- ffmpeg

## Setup

Install dependencies:

```
npm install
```

Provide the needed settings in `config.json`:

```JSON
{
  "mqtt": {
    "url": "[mqtt_server_address]",
    "username": "[mqtt_username]",
    "port": [mqtt_port]
  },

  "thingyId": "[name_of_the_thingy]",
  "streamUrl": "[rtsp_stream_url]"
}

```

An example config is the following:

```JSON
{
  "mqtt": {
    "url": "mqtt://mqtt.thing.zone",
    "username": "green",
    "port": 1895
  },

  "thingyId": "Thingy4563",
  "streamUrl": "rtsp://192.168.0.238:8080/video/h264"
}
```

## Usage

The mqtt password needs to be provided as ENV variable. To run the application:

```
MQTT_PASSWORD=[secret_password] node app.js
```
