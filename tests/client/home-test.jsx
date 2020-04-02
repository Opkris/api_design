const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');

const {Home} = require('../../src/client/home');

const needToLogInMessage = "You need to log-in to start playing";

test("Test not logged in", async () => {

    const driver = mount(<Home/>);

    const html = driver.html();
    expect(html.includes(needToLogInMessage)).toEqual(true);
});

test("Test logged in", async () =>{

    const victories = 1337;
    const defeats = 42;

    const user = {id: "User1", victories,defeats};
    const  fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());

    const driver = mount(
        <MemoryRouter initialEntries={["/home"]}>
            <Home fetchAndUpdateUserInfo={fetchAndUpdateUserInfo} user={user}/>
        </MemoryRouter>
    );

    const html = driver.html();
    expect(html.includes(needToLogInMessage)).toEqual(false);
    expect(html.includes(victories)).toEqual(true)
    expect(html.includes(defeats)).toEqual(true)
});