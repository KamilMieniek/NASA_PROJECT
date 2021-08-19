const express = require('express');
const {httpGetAllHabitablePlanets} = require('./planets.controller');

const planetsRouter = express.Router();

planetsRouter.get('/planets', httpGetAllHabitablePlanets)

module.exports = {planetsRouter}