const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');
const db = mongoose.connection;
const server = http.createServer(app);

const MONGO_URL =
  'mongodb+srv://nasa-api:LHGcPpgwa8pGOzoe@nasacluster.mqyhn.mongodb.net/nasa?retryWrites=true&w=majority';

db.once('open', () => {
  console.log('Mongoose connection ready!');
});
db.on('error', (err) => {
  console.log(err);
});

const { loadPlanetData } = require('./models/planets.model');
const PORT = process.env.PORT || 8000;

async function startServer() {
  await mongoose.connect(MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});
  await loadPlanetData();

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
  });
}

startServer();
