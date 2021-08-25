const launchesDataBase = require('./launches.mongo');
// const launches = new Map();

let latestFlightNumber = 100;
const launch231 = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  destination: 'Kepler-452 b',
  customer: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

async function getAllLaunches() {
  try {
    return await launchesDataBase.find({});
  } catch (error) {
    console.error(error);
  }
}
async function saveLaunch(launch) {
  await launchesDataBase.findOne(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
  console.log(`done ${JSON.stringify(launch)}`);
}

function addNewLaunch(launch) {
  //launch store properties: mission, rocket, destination, launchDate
  // missing flightNumber, customers, upcoming, success

  launch = Object.assign(
    {
      flightNumber: 100,
      customers: ['ZTM', 'NASA'],
      upcoming: true,
      success: true,
    },
    launch
  );
  saveLaunch(launch);
}

function handleError(error) {
  console.log('Cosik sie wyjebało ' + error);
}
addNewLaunch({
  information: 'launch added',
  mission: 'ZTM124233',
  rocket: 'ZTM EXP',
  destination: 'Polsza',
  launchDate: '2030-01-12T23:00:00.000Z',
});
function existLaunchWithId(id) {
  return launches.has(Number(id));
}
function abortLaunchByID(id) {
  const abortedLaunch = launches.get(Number(id));
  abortedLaunch.upcoming = false;
  abortedLaunch.success = false;
  return abortedLaunch;
}

module.exports = {
  getAllLaunches: getAllLaunches,
  addNewLaunch: addNewLaunch,
  abortLaunchByID: abortLaunchByID,
  existLaunchWithId: existLaunchWithId,
};
