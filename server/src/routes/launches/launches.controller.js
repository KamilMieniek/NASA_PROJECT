const {getAllLaunches, addNewLaunch} = require('../../models/launches.model');

function httpGetAllLaunches(req,res){
    const launchesArr = getAllLaunches()   
    res.status(200).json(launchesArr)
}

function httpAddNewLaunch(req,res){
    const launch = req.body
    launch.launchDate = new Date(launch.launchDate)
    console.log(launch);
    addNewLaunch(launch)
    return res.status(201).json({information : "launch added"})
}

module.exports = {httpGetAllLaunches, httpAddNewLaunch}