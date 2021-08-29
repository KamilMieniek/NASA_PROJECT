const mongoose = require('mongoose');
const db = mongoose.connection;
const MONGO_URL = process.env.MONGO_URL;
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
