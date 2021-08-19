const {getAllHabitablePlanets} = require('../../models/planets.model');

function httpGetAllHabitablePlanets(req,res){
    const habitablePlanets = getAllHabitablePlanets()
    return res.status(200).json(habitablePlanets)
}

module.exports = {
    httpGetAllHabitablePlanets : httpGetAllHabitablePlanets
}