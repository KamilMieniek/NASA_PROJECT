const express = require('express');
const planetsRouter = require('./routes/planets/planets.router');
const cors = require('cors');
const app = express();

var corsOptions = {
    origin: 'http://localhost:3000'
  }

app.use(cors(corsOptions))
app.use(express.json())
app.use(planetsRouter)


module.exports = app;