const mongoose = require('mongoose');
const db = mongoose.connection;
const MONGO_URL =
  'mongodb+srv://nasa-api:LHGcPpgwa8pGOzoe@nasacluster.mqyhn.mongodb.net/nasa?retryWrites=true&w=majority';
db.once('open', () => {
  console.log('Mongoose connection ready!');
});
db.on('error', (err) => {
  console.log(err);
});
async function mongoConnect() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}
module.exports = { mongoConnect, mongoDisconnect };
