const {getAllHabitablePlanets} = require('../../models/planets.model');

async function httpGetAllHabitablePlanets(req,res){
    return res.status(200).json(await getAllHabitablePlanets())
}

module.exports = {
    httpGetAllHabitablePlanets : httpGetAllHabitablePlanets
}