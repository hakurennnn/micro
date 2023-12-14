const http = require('http');
const fs = require('fs');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const port = new SerialPort('COM8', {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

const index = fs.readFileSync('index.html');

const server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(index);
});

const io = require('socket.io')(server);

let isSensorConnected = false;
let dataBuffer = [];

io.on('connection', function (socket) {
    console.log('Client connected');
    socket.emit('sensorStatus', isSensorConnected);
});

parser.on('data', function (data) {
    console.log('Received data from port: ' + data);

    // Assuming data is the gas concentration value
    const inputValue = parseFloat(data);
    const predictedValue = predictValue(inputValue);

    // Buffer the data to smooth out updates
    dataBuffer.push(inputValue);

    // Limit the buffer size to, for example, the last 10 data points
    if (dataBuffer.length > 10) {
        dataBuffer.shift(); // Remove the oldest data point
    }

    // Calculate the average of the buffered data
    const averageValue = dataBuffer.reduce((sum, value) => sum + value, 0) / dataBuffer.length;

    io.emit('gasData', averageValue);
    io.emit('sensorStatus', isSensorConnected);
    io.emit('predictedValue', predictedValue);
});

port.on('open', function () {
    console.log('Serial port opened');
    isSensorConnected = true;
    io.emit('sensorStatus', isSensorConnected);
});

port.on('close', function () {
    console.log('Serial port closed');
    isSensorConnected = false;
    io.emit('sensorStatus', isSensorConnected);
});

server.listen(3000);

function predictValue(x) {
    // Add your prediction logic here
    // For example, you can use a machine learning model or any custom logic
    // This example assumes a simple linear model
    const intercept = 2.5;
    const slope = 1.8;
    return intercept + slope * x;
}
