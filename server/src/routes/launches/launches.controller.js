const {
  getAllLaunches,
  addNewLaunch,
  abortLaunchByID,
  existLaunchWithId,
} = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
  const launchesArr = getAllLaunches();
  res.status(200).json(launchesArr);
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.destination
  ) {
    return res.status(400).json({
      error: 'Missing required launch property',
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date',
    });
  }
  addNewLaunch(launch);
  return res
    .status(201)
    .json(Object.assign({ information: 'launch added' }, launch));
}

function httpAbortLaunch(req, res) {
  if (!existLaunchWithId(req.params.id)) {
    return res.status(404).json({
      error: 'Launch not found',
    });
  }
  return res.status(200).json(abortLaunchByID(req.params.id));
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
