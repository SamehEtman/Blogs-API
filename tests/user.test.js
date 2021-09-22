const request = require('supertest');
const app = require('../app');
const data = require('./fixtures/dp');

beforeAll((done) => {
  data.connectTestDB();
  done();
});
beforeEach(data.setUpEnv);

afterAll((done) => {
  data.disconnectTestDB();
  data.diconnectRedis();
  done();
});

test('Should sign up non-existing user', async () => {
  const response = await request(app)
    .post('/sign')
    .send({ email: 'does not exist ', password: 'password' })
    .expect(201);
  expect(response.body.token).not.toBe(null);
});

test('Should not sign up existing user', async () => {
  const response = await request(app).post('/sign').send(data.user).expect(500);
});

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/login')
    .send(data.user)
    .expect(200);
});
test('Should not login non-existing user', async () => {
  const response = await request(app)
    .post('/login')
    .send({
      email: 'dummy@dummy.gmail',
      password: '1234',
    })
    .expect(404);
});
