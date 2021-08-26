const http = require('http');
const { mongoConnect } = require('./services/mongo');
const { loadPlanetData } = require('./models/planets.model');
const app = require('./app');

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

async function startServer() {
  mongoConnect();
  // loadPlanetData()
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
  });
}

startServer();
