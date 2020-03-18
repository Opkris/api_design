const request = require('supertest');
const app = require('../../../src/server/app');

let counter = 0;

test("Test to fail login", async () => {

    const response = await request(app)
        .post('/api/login')
        .send({userId: 'test' + (counter ++), password: "randomPassword"})
        .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(401);
});


test("Test fail access data on non-existing user", async () => {

    const response = await request(app).get('/api/user');

    expect(request.statusCode).toBe(401);
});

test("Test to Create user with wrong data", async () => {

    const userId= "RandomUser" + (counter++);

    let response = await request(app)
        .post('/api/signup')
        .send({userId, password:"totalFail"})
        .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(201);


    // We dont use eny cookies here, so authentication fails
    response = await request(app).get('/api/user');

    expect(response.statusCode).toBe(401);
});

test("Test create user, and get the data", async () => {

    const userId = "happyUser" + (counter++);

    // Use same cookie jar for the HTTP request
    const agent = request.agent(app);

    let response = await agent
        .post('/api/signup')
        .send({userId, password:"happyHappy"})
        .set("Content-Type", "application/json");

    expect(response.statusCode).toBe(201);

    //here we are using the same cookie we "created" from previous HTTP call
    response = await agent.get('/api/user');

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(userId);
    expect(response.body.password).toBeUndefined();
});

test("Test create user, login in a different session and get data", async () => {

    const userId = "Json" + (counter++);
    const userPassword = "tacoNight";

    //Here we Create user, but we ignore cookie set with the HTTP response
    let response = await request(app)
        .post('/api/signup')
        .send({userId,userPassword})
        // .send({userId, password: "tacoNight"})
        .set("Content-Type",'application/json');

    expect(response.statusCode).toBe(201);

    //Create new cookie jar for the HTTP request's
    const agent = await request.agent(app);

    //do login, which will get a new cookie
    response = await agent
        .post('/api/login')
        // .send({userId, password: "tacoNight"})
        .send({userId, userPassword})
        .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(204);


    //using the same cookie we got from previous HTTP call
    response = await agent.get('/api/user');

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(userId);
    expect(response.body.password).toBeUndefined();

});

test("Test to Login after logout", async () => {

    const userId = "WebStorm" + (counter++);
    const userPassword = "webStormPw";

    const agent = request.agent(app);

    //Create User
    let response = await agent
        .post('api/signup')
        .send({userId, userPassword})
        .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(201);

    // here we are getting the info we just created
    response = await agent.get('/api/user');
    expect(response.statusCode).toBe(204);

    //logging out
    response = await agent.get('/api/logout');
    expect(response.statusCode).toBe(204);

    // when we are logged out, we should fail when we are trying to get det data
    response = agent.get('/api/user');
    expect(response.statusCode).toBe(401);

    // now we are logging in again
    response = await agent
        .post('/api/login')
        .send({userId, userPassword})
        .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(204);

    // now we are logged in, we can get det data back
    response = await ('/api/user');
    expect(response.statusCode).toBe(200);

});