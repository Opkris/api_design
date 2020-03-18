const React = require('react');
const {mount} = require('enzyme');
const {Match} = require("../../src/client/match");
const {quizzes} = require("../../src/server/db/quizzes");
const {overrideFetch, asyncCheckCondition} = require('../mytest-utils');
const app = require('../../src/server/app');
const {resetAllUsers} = require('../../src/server/db/users');

{
    /*
    Full Rendering API (mount(...) )

    full DOM rendering is ideal for use cases where you have components that may
    interact with DOM APIs or need to test components that are wrapped in higher
    order components.

    Full DOM rendering require that a full DOM API be available at the global scope.
    This means that is must be run in an environment that at least "looks like"
    a browser environment. If you do not want to run your tests inside of a browser,
    the recommended approach to using mount is to depend on a library called jsdom
    which is essentially a headless browser implemented completely in JS.

    NOTE: unlike shallow or static rendering, full rendering actually mounts the
    component in the DOM, which means that tests can affect each other if they are
    all using the same DOM. Keep that in mind while writing tests and, if necessary,
    use .unmount() or something similar as cleanup.
    */
}


beforeEach(() => {
    resetAllUsers();
});


    async function signup(userId, password) {
        const response = await fetch('/api/signup', {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userId: userId, password: password})
            }
        );

        return response.status === 201;
    }


function isQuizDisplayed(driver){

    const quiz = driver.find('.quiz');

    // Check if we can display the question and only 1 at the time.
    const questions = driver.find('.question');
    // expect(questions.length).toEqual(1);

    //check if we can display the answers as well.
    // .answer is referred to "renderAnswerTag " class name.
    const answers = driver.find('.answer');
    // expect(answers.length).toEqual(4);

    return quiz.length === 1 && questions.length === 1 && answers.length === 4;
}

function getDisplayedQuiz(driver){

    const quizDiv = driver.find('.quiz').at(0);
    const html_id = quizDiv.prop('id');
    const id = parseInt(html_id.substring("quiz_".length, html_id.length));

    const quiz = quizzes.find(e => e.id === id);
    return quiz;
}

async function waitForQuizDisplayed(driver){

    const displayed = await asyncCheckCondition(() => {
        driver.update();
        return isQuizDisplayed(driver);
    }, 2000, 200);

    return displayed;
}

test("Test rendered quiz", async () => {

    overrideFetch(app);

    const driver = mount(<Match/>);

    const displayed = await waitForQuizDisplayed(driver);

    expect(displayed).toEqual(true);
});

    /*
        const driver = mount(<Match/>);

        isQuizDisplayed(driver);

        const quiz = getDisplayedQuiz(driver);
        const wrong = (quiz.indexOfRightAnswer + 1) % 4;

        const first = driver.find('.answer').at(wrong);
        first.simulate('click');

        const lost = driver.html().include("Lost");
        const won = driver.html().include("Won");

        expect(lost).toEqual(true);
        expect(won).toEqual(false);
    */


    test("Test do answer correctly", async () => {

        overrideFetch(app);

        const driver = mount(<Match/>);

        await waitForQuizDisplayed(driver);

        const quiz = getDisplayedQuiz(driver);
        const correct = quiz.indexOfRightAnswer;

        const first = driver.find('.answer').at(correct);
        first.simulate('click');

        const lost = driver.html().includes("Lost");
        const won = driver.html().includes('Won');

        expect(lost).toEqual(false);
        expect(won).toEqual(false);


        const displayed = await waitForQuizDisplayed(driver);
        expect(displayed).toEqual(true);


        /*
            const driver = mount(<Match/>);

            isQuizDisplayed(driver);

            const quiz = getDisplayedQuiz(driver);
            const correct = quiz.indexOfRightAnswer;

            const first = driver.find('.answer').at(correct);
            first.simulate('click');

            const lost = driver.html().include("Lost");
            const won = driver.html().include("Won");

            expect(lost).toEqual(false);
            expect(won).toEqual(false);

            isQuizDisplayed(driver);
        */
    });
test("Test do answer wrong", async () => {

    overrideFetch(app);

    const driver = mount(<Match/>);

    await waitForQuizDisplayed(driver);

    const quiz = getDisplayedQuiz(driver);
    const wrong = (quiz.indexOfRightAnswer + 1) % 4;

    const first = driver.find('.answer').at(wrong);
    first.simulate('click');

    const lost = driver.html().includes("Lost");
    const won = driver.html().includes("Won");

    expect(lost).toEqual(true);
    expect(won).toEqual(false);
});




    test("Test win match", async () =>{
  //test("Test win match", async () => {

            overrideFetch(app);

            const driver = mount(<Match/>);

            await waitForQuizDisplayed(driver);

            for (let i = 0; i < 3; i++) {
                const quiz = getDisplayedQuiz(driver);
                const correct = quiz.indexOfRightAnswer;

                const first = driver.find('.answer').at(correct);
                first.simulate('click');

                driver.update();

                /*
                    Note: to be precise, here we should wait until a new Quiz is displayed, or the Win/Lose page,
                    however, as those do not require any async operation in the app,
                    then we should still be fine in this case even without an explicit wait
                */
            }
            const lost = driver.html().includes("Lost");
            const won = driver.html().includes('Won');

            expect(lost).toEqual(false);
            expect(won).toEqual(true);


            /*
                 const driver =mount(<Match/>);

                 for (let i = 0; i < 3; i++) {
                     isQuizDisplayed(driver);

                     const quiz = getDisplayedQuiz(driver);
                     const correct = quiz.indexOfRightAnswer;

                     const first = driver.find('.answer').at(correct);
                     first.simulate('click');
                 }
                 const lost = driver.html().include("Lost");
                 const won = driver.html().include("Won");

                 expect(lost).toEqual(false);
                 expect(won).toEqual(true);
             */
        });

