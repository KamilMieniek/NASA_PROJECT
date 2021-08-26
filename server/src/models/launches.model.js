const launchesDataBase = require('./launches.mongo');
const planets = require('./planets.mongo');

let DEFAULT_FLIGHT_NUMBER = 100;

async function getAllLaunches() {
  try {
    return await launchesDataBase.find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    );
  } catch (error) {
    console.error(error);
  }
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.destination });
  if (!planet) {
    throw new Error('No matching planet was found');
  }
  await launchesDataBase.updateOne(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
}

async function getLatestFLightNumber() {
  const latestLaunch = await launchesDataBase.findOne().sort('+flightNumber');
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function scheduleNewLaunch(launch) {
  //launch store properties: mission, rocket, destination, launchDate
  // missing flightNumber, customers, upcoming, success
  const newFlightNumber = (await getLatestFLightNumber()) + 1;
  launch = Object.assign(
    {
      flightNumber: newFlightNumber,
      customers: ['NASA'],
      upcoming: true,
      success: true,
    },
    launch
  );
  await saveLaunch(launch);
}

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
  scheduleNewLaunch: scheduleNewLaunch,
  abortLaunchByID: abortLaunchByID,
  existLaunchWithId: existLaunchWithId,
};
