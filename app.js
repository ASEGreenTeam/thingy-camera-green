const mqtt = require('async-mqtt');
const chokidar = require('chokidar')
const http = require('http');
const fs = require('fs');
const path = require('path');
const config = require('config.json')('./config.json');
const base64 = require('./base64');
const { exec } = require('child_process');

// Initialize watcher.
var watcher = chokidar.watch('images', {
  ignored: /(^|[\/\\])\../,
  persistent: true
});

// Something to use when events are received.
var log = console.log.bind(console);

const client = mqtt.connect(config.mqtt.url, {port: config.mqtt.port, username: config.mqtt.username, password: process.env.MQTT_PASSWORD});

client.on('connect', () => {
  console.log('Connected to MQTT server!')
  client.subscribe(`${config.thingyId}/images/take_snapshot`)
});
client.on('message', onMessage);
client.on('error', e => {
  log(e);
});


function onMessage(topic, message) {
  //TODO: Call code that puts image into folger './images'
  exec('ffmpeg -loglevel panic -i rtsp://192.168.0.238:8080/video/h264 -vframes 1 "images/$(date +"%Y%m%d%H%M%S")_snapshot.png"', (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
}


function onFileMessage(topic, message) {
  // message is Buffer
  let deviceUri, serviceUUID, characteristicUUID, action;
  [deviceUri, serviceUUID, characteristicUUID, action] = topic.split('/');
  encoded = JSON.parse(message)
  base64.decode(encoded.data, `received/${encoded.filename}`)
  log(`MQTT message: ${encoded.filename}`);
}


// Add event listeners.
watcher
  .on('add', fileAddedHandler);


function fileAddedHandler(file) {
  data = base64.encode(file)
  client.publish(`${config.thingyId}/images/snapshot`, JSON.stringify({ filename: path.basename(file), data: data }));
}


const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  client.publish(`${config.thingyId}/images/take_snapshot`, 'someString');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Thingy Camera Capture Running!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
