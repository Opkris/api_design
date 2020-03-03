const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const matchApi = require('./router/match-api');

const app = express();

//to handle JSON payLoads
app.use(bodyParser.json());

// ***** Routers ***** //
app.use('/api', matchApi);

app.use(express.static('public'));

app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
});

module.exports = app;