const launches = new Map()


let latestFlightNumber = 100;
const launch = {
flightNumber: 100,
mission : "Kepler Exploration X",
rocket : "Explorer IS1",
launchDate: new Date('December 27, 2030'),
destination : 'Kepler-452 b',
customer: ['ZTM', 'NASA'],
upcoming: true,
success: true,
}

launches.set(launch.flightNumber,launch)

function getAllLaunches(){
    return [...launches.values()]
}
function addNewLaunch(launch){
    latestFlightNumber++;
    launches.set(latestFlightNumber,Object.assign(launch,{
        success :true,
        customer : ['ZTM','NASA'],
        upcoming : true,
        flightNumber : latestFlightNumber}))
}


module.exports = {
    getAllLaunches : getAllLaunches,
    addNewLaunch : addNewLaunch
}