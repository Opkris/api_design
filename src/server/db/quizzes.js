const quizzes = [
    {
        question: "What kind of language is JavaScript?",
        answers: [
            "Strongly and statically typed",
            "Strongly and dynamically typed",
            "Weakly and statically typed",
            "Weakly and dynamically typed",
        ],
        indexOfRightAnswer: 3,
        id: 0

    },
    {
        question: "In JavaScript, what is the result of the following?\n\n+(!![]+!![]+!![]+!![]+[]+(!![]+!![]))",
        answers: [
            "Compilation exception",
            "Runtime exception",
            "42",
            "'42'"
        ],
        indexOfRightAnswer: 2,
        id: 1
    },
    {
        question: "In JavaScript, what is the result of the following?\n\n[3,18,1,2].sort()\n",
        answers: [
            "[1, 2, 3, 18]",
            "[1, 18, 2, 3]",
            "[18, 1, 2, 3]",
            "Runtime exception"
        ],
        indexOfRightAnswer: 1,
        id: 2
    },
    {
        question: "In JavaScript, what is the result  of the following?\n\nfalse + true?",
        answers: [
            "false",
            "true",
            "'falsetrue'",
            "1"
        ],
        indexOfRightAnswer: 3,
        id: 3
    },
    {
        question: "What is Babel mainly used for?",
        answers: [
            "To transpile code into valid JS code",
            "To bundle together the code of different JS files",
            "To download third-party dependencies",
            "To run tests cases"
        ],
        indexOfRightAnswer: 0,
        id: 4
    },
    {
        question:" What is SEO?",
        answers:[
          "Search Educe Organization",
          "Search Educe Optimization",
          "Search Engine Optimization",
          "Search Engine Organization"
        ],
        indexOfRightAnswer: 2,
        id: 5
    },
    {
        question:" What is SPA",
        answers:[
          "Search Partner Application",
          "Single Page Application",
          "Search Page Advice",
          "Search Paragraph Applicant"
        ],
        indexOfRightAnswer: 1,
        id: 6
    }
];

/*
export function getRandomQuizzes(numberOfQuizzes){

    if(numberOfQuizzes < 1){
        throw "Invalid number of requested quizzes: " + n;
    }

    if(numberOfQuizzes > quizzes.length){
        throw "Too many quizzes";
    }

    const selection = Array(numberOfQuizzes);

    let i = 0;
    while (i < numberOfQuizzes) {

        const k = Math.floor(quizzes.length * Math.random());
        if (selection.includes(k)) {
            continue;
        }

        selection[i] = k;
        i++;
    }

    return Array.from(selection).map(e => quizzes[e]);
}*/

function getRandomQuizzes(numberOfQuizzes){

    if(numberOfQuizzes < 1){
        throw "Invalid number of requested quizzes: " + n;
    }

    if(numberOfQuizzes > quizzes.length){
        throw "Too many quizzes"
    }

    const selection = Array(numberOfQuizzes);

    let i = 0;
    while (i < numberOfQuizzes){

        const k = Math.floor(quizzes.length * Math.random());
        if(selection.includes(k)){
            continue;
        }

        selection[i] = k;
        i++;
    }

    return Array.from(selection).map( e=> quizzes[e]);
}

module.exports = {quizzes, getRandomQuizzes};




   /* const url = "https://opentdb.com/api.php?type=multiple&amount=" + numberOfQuizzes;
    let response;
    let payload;

    try{
        response = await fetch(url);
        payload = await response.json();
    }catch (err){
        return null;
    }

    if (response.status !== 200){
        return null;
    }

    return payload.results.map(q => {

        const correct = Math.floor(Math.random() * Math.floor(3));
        const answers = q.incorrect_answers;
        answers.splice(correct, 0, q.correct_answer);

        return {
            question: q.question,
            answers: answers,
            indexOfRightAnswer: correct,
            id: 0
        };
    })
}*/


