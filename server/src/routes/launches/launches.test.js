/* eslint-disable linebreak-style */
const request = require('supertest');

const app = require('../../app');
describe('Test Get /launches', () => {
  test('It should respond with 200 success', () => {
    return request(app)
        .get('/launches')
        .expect('Content-type', /json/)
        .expect(200);
  });
});

describe('Test POST /launch', () => {
  const completeLaunchData = {
    mission: 'USS Enterprise',
    rocket: 'NCC 1702',
    destination: 'Keplar-186',
    launchDate: 'January 7, 2028',
  };
  const launchDataWithoutDate = {
    mission: 'USS Enterprise',
    rocket: 'NCC 1702',
    destination: 'Keplar-186',
  };
  const launchDataWithWrongDate = {
    mission: 'USS Enterprise',
    rocket: 'NCC 1702',
    destination: 'Keplar-186',
    launchDate: 'eqweqqwe ewq',
  };
  test('It should respond with 201 created', async ()=>{
    const response = await request(app)
        .post('/launches')
        .send(completeLaunchData)
        .expect('Content-type', /json/)
        .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf;
    const responseDate = new Date(response.body.launchDate).valueOf;
    expect(responseDate).toBe(requestDate);
  });
  test('It should catch missing required properties', async ()=>{
    const response = await request(app)
        .post('/launches')
        .send(launchDataWithoutDate)
        .expect('Content-type', /json/)
        .expect(400);
    expect(response.body).toStrictEqual({
      error: 'Missing required launch property',
    });
  });
  test('It should catch bad date format', async ()=>{
    const response = await request(app)
        .post('/launches')
        .send(launchDataWithWrongDate)
        .expect('Content-type', /json/)
        .expect(400);
    expect(response.body).toStrictEqual({
      error: 'Invalid launch date',
    });
  });
});


