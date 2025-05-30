require('dotenv').config();
const oasTelemetry = require('@oas-tools/oas-telemetry');
const http = require('http');
const { readFileSync } = require('fs');
const express = require("express");
const { initialize } = require('@oas-tools/core');


const serverPort = 8080;
const app = express();
app.use("/",express.static("./public"));
app.use(express.json({limit: '50mb'}));
app.use(oasTelemetry({
    spec: readFileSync('./api/oas-file.yaml', { encoding: 'utf8', flag: 'r' })
}));
const config = {}


initialize(app, config).then(() => {
    http.createServer(app).listen(serverPort, () => {
    console.log("\nApp running at http://localhost:" + serverPort);
    console.log("________________________________________________________________");
    if (!config?.middleware?.swagger?.disable) {
        console.log('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
        console.log("________________________________________________________________");
    }
    });
});
