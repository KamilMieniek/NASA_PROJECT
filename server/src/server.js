const http = require('http');
require('dotenv').config();
const { mongoConnect } = require('./services/mongo');
const app = require('./app');
const { loadLaunchData } = require('./models/launches.model');
const { loadPlanetData } = require('./models/planets.model');
const server = http.createServer(app);

const PORT = process.env.PORT || 9000;

async function startServer() {
  mongoConnect();
  loadLaunchData();
  loadPlanetData();
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
  });
}

startServer();
