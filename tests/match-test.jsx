const React = require('react');
const { mount } = require('enzyme');
const { Match } = require("../src/match");

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

test("test quiz", () => {

    const displayQuiz = mount(<Match/>);
    quizIsDisplayed(displayQuiz);

});

test("Test answer", () => {

    const displayAnswer = mount(<Match/>);

    let message = undefined;

    global.alert = (s) => {message = s};

    const first = displayAnswer.fint('.answer').at(0);
    first.simulate('click');

    quizIsDisplayed(displayAnswer);
    expect(message).toBeDefined();

})