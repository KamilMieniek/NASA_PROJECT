// const launches = require('./launches.mongo');
const launches = new Map();

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

launches.set(launch231.flightNumber, launch231);

function getAllLaunches() {
  return [...launches.values()];
}
function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      customer: ['ZTM', 'NASA'],
      upcoming: true,
      flightNumber: latestFlightNumber,
    })
  );
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
  addNewLaunch: addNewLaunch,
  abortLaunchByID: abortLaunchByID,
  existLaunchWithId: existLaunchWithId,
};
