const {
  getAllLaunches,
  saveLaunch,
  abortLaunchByID,
  existLaunchWithId,
  scheduleNewLaunch,
} = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
  const launchesArr = await getAllLaunches();
  res.status(200).json(launchesArr);
}

async function httpScheduleNewLaunch(req, res) {
  try {
    let launch = req.body;
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
    await scheduleNewLaunch(launch);
    return res
      .status(201)
      .json(Object.assign({ information: 'launch added' }, launch));
  } catch (error) {
    console.error(error.message);
  }
}

function httpAbortLaunch(req, res) {
  if (!existLaunchWithId(req.params.id)) {
    return res.status(404).json({
      error: 'Launch not found',
    });
  }
  return res.status(200).json(abortLaunchByID(req.params.id));
}

module.exports = {
  httpGetAllLaunches,
  httpScheduleNewLaunch,
  httpAbortLaunch,
};
