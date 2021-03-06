const parse = require('csv-parse');
const fs = require('fs');

const planets = require('./planets.mongo');

const path = require('path');
function isHabitablePlanet(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
}

async function getAllHabitablePlanets() {
  try {
    return await planets.find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    );
  } catch (error) {
    console.error('GetAllHabitablePlanet\n', error);
  }
}

function loadPlanetData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')
    )
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('end', async () => {
        const countOfHabitablePlanets = (await getAllHabitablePlanets()).length;
        console.log(`${countOfHabitablePlanets} habitable planets found!`);
        resolve();
      });
  });
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.error(`Could not save planet ${error}`);
  }
}

module.exports = {
  loadPlanetData: loadPlanetData,
  getAllHabitablePlanets: getAllHabitablePlanets,
};
