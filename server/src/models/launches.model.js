const launchesDataBase = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function getAllLaunches(skip, limit) {
  try {
    return await launchesDataBase
      .find(
        {},
        {
          _id: 0,
          __v: 0,
        }
      )
      .skip(skip)
      .limit(limit);
  } catch (error) {
    console.error(error);
  }
}

async function saveLaunch(launch) {
  await launchesDataBase.updateOne(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
}

async function findLaunch(filter) {
  return await launchesDataBase.findOne(filter);
}
async function populateLaunches() {
  console.log('Downloading launch data...');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        { path: 'rocket', select: 'name' },
        { path: 'payloads', select: { customers: 1 } },
      ],
    },
  });
  if (response.status !== 200) {
    console.log('Problem downloading launches from SPACEX');
    throw new Error('Launch data download failed!');
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });
    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers: customers,
    };
    saveLaunch(launch);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });
  if (firstLaunch) {
    console.log('Launch data already launched');
  } else {
    await populateLaunches();
  }
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

  const planet = await planets.findOne({ keplerName: launch.destination });
  if (!planet) {
    throw new Error('No matching planet was found');
  }

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
  loadLaunchData: loadLaunchData,
  scheduleNewLaunch: scheduleNewLaunch,
  existLaunchWithId: existLaunchWithId,
  abortLaunchByFlightNumber: abortLaunchByFlightNumber,
};
