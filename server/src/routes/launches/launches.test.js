const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');
describe('Test launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('Test Get /v1/launches', () => {
    test('It should respond with 200 success', () => {
      return request(app)
        .get('/v1/launches')
        .expect('Content-type', /json/)
        .expect(200);
    });
  });

  describe('Test POST /v1/launch', () => {
    const completeLaunchData = {
      mission: 'USS Enterprise',
      rocket: 'Moje krzeslo',
      destination: 'Kepler-62 f',
      launchDate: 'January 7, 2028',
    };
    const launchDataWithoutDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1702',
      destination: 'Kepler-62 f',
    };
    const launchDataWithWrongDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1702',
      destination: 'Kepler-62 f',
      launchDate: 'eqweqqwe ewq',
    };
    test('It should respond with 201 created', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect('Content-type', /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf;
      const responseDate = new Date(response.body.launchDate).valueOf;
      expect(responseDate).toBe(requestDate);
    });
    test('It should catch missing required properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-type', /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: 'Missing required launch property',
      });
    });
    test('It should catch bad date format', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithWrongDate)
        .expect('Content-type', /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: 'Invalid launch date',
      });
    });
  });
});
