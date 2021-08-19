const {getAllLaunches} = require('../../models/launches.model');

function httpGetAllLaunches(req,res){
    const launchesArr = getAllLaunches()   
    res.status(200).json(launchesArr)
}

module.exports = {httpGetAllLaunches}