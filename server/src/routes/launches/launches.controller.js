const {
  getAllLaunches,
  abortLaunchByFlightNumber,
  existLaunchWithId,
  scheduleNewLaunch,
} = require('../../models/launches.model');

const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  res.status(200).json(launches);
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
      .json(Object.assign(launch, { information: 'launch added' }));
  } catch (error) {
    console.error(error.message);
  }
}

async function httpAbortLaunch(req, res) {
  if (!(await existLaunchWithId(req.params.id))) {
    return res.status(404).json({
      error: 'Launch not found',
    });
  }

  const aborted = await abortLaunchByFlightNumber(req.params.id);
  console.log(`aborted ________ ${aborted}`);
  if (!aborted) {
    return res.status(400).json({
      error: 'launch not aborted',
    });
  }
  return res.status(200).json({ ok: true });
}

module.exports = {
  httpGetAllLaunches,
  httpScheduleNewLaunch,
  httpAbortLaunch,
};
