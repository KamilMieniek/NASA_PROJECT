const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const app = express();

const api = require('./routes/api');

var corsOptions = {
  origin: 'http://localhost:3000',
};
//MIDDLEWEAR
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(cors(corsOptions));
app.use(express.json());
app.use('/v1', api);
//ROUTERS
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
module.exports = app;
