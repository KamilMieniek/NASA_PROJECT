const express = require('express');
const morgan = require('morgan')
const path = require('path');0
const {launchesRouter} = require('./routes/launches/launches.router');
const {planetsRouter} = require('./routes/planets/planets.router');
const cors = require('cors');
const app = express();

var corsOptions = {
    origin: 'http://localhost:3000'
  }
//MIDDLEWEAR
app.use(morgan("tiny"))
app.use(express.static(path.join(__dirname,"..","public")))
app.use(cors(corsOptions))
app.use(express.json())


//ROUTERS
app.use("/launches",launchesRouter)
app.use("/planets",planetsRouter)
app.get("/",(req,res) => {
  res.sendFile(path.join(__dirname,"..","public","index.html"))
})

app.get("/*",(req,res) => {
  res.sendFile(path.join(__dirname,"..","public","index.html"))
})
module.exports = app;