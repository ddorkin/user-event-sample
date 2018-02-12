const express = require('express');
const mountRoutes = require('./routes');
const bodyParser = require('body-parser');

require('console-stamp')(console, '[yyyy-mm-dd HH:MM:ss]');

process.on('uncaughtException', function (e) {
    console.log(e.stack || e);
    process.exit(1);
});

const app = express();
app.use(bodyParser.json());
mountRoutes(app);

app.listen(4000);
console.info("Server started on port 4000");