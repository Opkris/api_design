const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');

const {overrideFetch, asyncCheckCondition} = require('../mytest-utils');
const {app} = require('../../src/server/app');

const {Login} = require('../../src/client/login');
const {resetAllUsers, getUser, createUser} = require('../../src/server/db/users');

beforeEach(resetAllUsers);

function fillFrom(driver, id, password){

    const userIdInput = driver.find("#userIdInput").at(0);
    const passwordInput = driver.find("#passwordInput").at(0);
    const loginButton = driver.find("#loginBtn").at(0);

    userIdInput.simulate("change", {target: {value: id}});
    passwordInput.simulate("change",{target: {value: password}});

    loginButton.simulate("click");

}

test("Test fail login", async () => {

    overrideFetch(app);

    const driver = mount(
        <MemoryRouter initialEntries={["/login"]}>
            <Login/>
        </MemoryRouter>
    );

    fillFrom(driver, "test_user", "thisPasswordIsGood");

    const error = await asyncCheckCondition(
        () => {driver.update(); return driver.html().includes("Invalid userId/password")},
        2000,200);

    expect(error).toEqual(true);
});

test("Test valid login", async () =>{

    const userId = "im_am_a_user";
    const password = "goodPasswordHere";
    createUser(userId, password);

    overrideFetch(app);

    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    let page = null;
    const history = {push: (h) => {page=h}};

    const driver = mount(
        <MemoryRouter initialEntries={["/signup"]}>
            <Login fetchAndUpdateUserInfo={fetchAndUpdateUserInfo} history={history}/>
        </MemoryRouter>
    );

    fillFrom(driver, userId, password);

    const redirected = await asyncCheckCondition(
        () =>{return page ==="/"},
        2000, 200);

    expect(redirected).toEqual(true);
});