const express = require('express');
const path = require('path');
const planetsRouter = require('./routes/planets/planets.router');
const cors = require('cors');
const app = express();

var corsOptions = {
    origin: 'http://localhost:3000'
  }
app.use(express.static(path.join(__dirname,"..","public")))
app.use(cors(corsOptions))
app.use(express.json())
app.use(planetsRouter)
app.get("/",(req,res) => {
  res.sendFile(path.join(__dirname,"..","public","index.html"))
})

module.exports = app;