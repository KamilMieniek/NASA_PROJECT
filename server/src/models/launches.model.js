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
  const latestLaunch = await launchesDataBase.findOne().sort('-flightNumber');
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function scheduleNewLaunch(launch) {
  //launch store properties: mission, rocket, destination, launchDate
  // missing flightNumber, customers, upcoming, success
  const newFlightNumber = (await getLatestFLightNumber()) + 1;
  launch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ['NASA'],
    upcoming: true,
    success: true,
  });
  await saveLaunch(launch);
}

async function existLaunchWithId(id) {
  // return launches.has(Number(id));
  return await launchesDataBase.exists({ flightNumber: id });
}
async function abortLaunchByFlightNumber(id) {
  try {
    const abortedLaunch = await launchesDataBase.updateOne(
      { flightNumber: id },
      { upcoming: false, success: false }
    );
    // return (
    //   abortedLaunch.acknowledged === 1 && abortedLaunch.modifiedCount === 1
    // );
    return (
      abortedLaunch.acknowledged === true && abortedLaunch.modifiedCount === 1
    );
  } catch (error) {
    throw new Error('abortLaunch error\n' + error);
  }
}

module.exports = {
  getAllLaunches: getAllLaunches,
  scheduleNewLaunch: scheduleNewLaunch,
  abortLaunchByFlightNumber: abortLaunchByFlightNumber,
  existLaunchWithId: existLaunchWithId,
};
