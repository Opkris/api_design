const request = require('supertest');
const app = require('../../../src/server/app');

test("Test Create match with no auth", async () => {

    const response = await request(app).post('/api/matches');

    expect(response.statusCode).toBe(401);
});

test("Test create match with auth", async () => {

    const user = request.agent(app);

    const signup = await user.post('api/signup')
        .send({userId:"match_auth_test", password: "notPassword"})
        .set('Content-Type', 'application/json');

    expect(signup.statusCode).toBe(201);

    const response = await user.post('/api/matches');

    expect(response.statusCode).toBe(201);
    expect(response.body.length).toBe(3);


});