const React = require('react');
const {mount} = require('enzyme');
const {Match} = require("../src/client/match");
const {quizzes} = require("../src/server/db/quizzes");

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

function quizIsDisplayed(displayQuiz){

    // Check if we can display the question and only 1 at the time.
    const questions = displayQuiz.find('.question');
    expect(questions.length).toEqual(1);

    //check if we can display the answers as well.
    // .answer is referred to "renderAnswerTag " class name.
    const answers = displayQuiz.find('.answer');
    expect(answers.length).toEqual(4);

}

function getDisplayedQuiz(driver){

    const quizDiv = driver.find('.answer').at(0);
    const html_id = quizDiv.prop('id');
    const id = parseInt(html_id.substring("quiz_".length, html_id.length));

    const quiz = quizzes.find(e => e.id === id);
    return quiz;
}

test("Test rendered quiz", () => {

    const driver = mount(<Match/>);

    quizIsDisplayed(driver);

    const quiz = getDisplayedQuiz(driver);
    const wrong = (quiz.indexOfRightAnswer + 1) % 4;

    const first = driver.find('.answer').at(wrong);
    first.simulate('click');

    const lost = driver.html().include("Lost");
    const won = driver.html().include("Won");

    expect(lost).toEqual(true);
    expect(won).toEqual(false);

});

    test("Test do answer correctly", () => {

        const driver = mount(<Match/>);

        quizIsDisplayed(driver);

        const quiz = getDisplayedQuiz(driver);
        const correct = quiz.indexOfRightAnswer;

        const first = driver.find('.answer').at(correct);
        first.simulate('click');

        const lost = driver.html().include("Lost");
        const won = driver.html().include("Won");

        expect(lost).toEqual(false);
        expect(won).toEqual(false);

        quizIsDisplayed(driver);

    });

test("Test win match", () =>{

    const driver =mount(<Match/>);

    for (let i = 0; i < 3; i++) {
        quizIsDisplayed(driver);

        const quiz = getDisplayedQuiz(driver);
        const correct = quiz.indexOfRightAnswer;

        const first = driver.find('.answer').at(correct);
        first.simulate('click');
    }
    const lost = driver.html().include("Lost");
    const won = driver.html().include("Won");

    expect(lost).toEqual(false);
    expect(won).toEqual(true);
})