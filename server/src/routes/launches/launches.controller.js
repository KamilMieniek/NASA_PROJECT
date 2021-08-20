const {getAllLaunches, addNewLaunch} = require('../../models/launches.model');

function httpGetAllLaunches(req,res){
    const launchesArr = getAllLaunches()   
    res.status(200).json(launchesArr)
}

function httpAddNewLaunch(req,res){
    const launch = req.body
    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.destination){
        return res.status(400).json({
            error : 'Missing required launch property'
        })
    }
    launch.launchDate = new Date(launch.launchDate)
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error : "Invalid launch date"
        })
    }
    

    console.log(launch);
    addNewLaunch(launch)
    return res.status(201).json({information : "launch added"})
}

module.exports = {httpGetAllLaunches, httpAddNewLaunch}