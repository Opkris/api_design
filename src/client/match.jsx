import React from "react";
// import {getRandomQuizzes} from "../server/db/quizzes";
import { withRouter} from "react-router-dom";

export class Match extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            match: null,
            error: null
        };
    }

    componentDidMount(){
        this.startNewMatch();
    }

    startNewMatch = async () => {

        /*
            The Promise object represents the eventual completion (or failure) of an asynchronous
            operation, and its resulting value

            Description of await:
            The await expression causes async function execution to pause until a Promise is settled (that is, fulfilled or rejected),
            and to resume execution on the async function after fulfillment. When resumed, the value of the await
            expression is that of hte fulfilled Promise
        */

        //Because getRandomQuizzes is async, it does return a Promise we van wait on
        const quizzes = await this.getRandomQuizzes(3);

        this.setState(
            !quizzes ? {error: "Error when connecting to server"}
            : {
                error: null,
                match: {
                    victory: false,
                    defeat: false,
                    quizzes: quizzes,
                    currentIndex: 0,
                    numberOfQuizzes: quizzes.length
                }
            }
        );
    };

    getRandomQuizzes = async numberOfQuizzes => {
        if (numberOfQuizzes < 1) {
            throw " Invalid number of requested quizzes" + n;
        }
        const url = "/api/matches";
        let response;
        let payload;

        try {
            response = await fetch(url, {method: "post"});
            payload = await response.json();
        } catch (err) {
            return null;
        }

        if (response.status !== 201) {
            return null;
        }

        return payload;
    }


    handleClick = correct => {
        if (correct) {
            if (this.state.match.currentIndex === this.state.match.numberOfQuizzes - 1) {
                //last quiz
                this.setState({match: {victory: true}});
            } else {
                //go on to next quiz
                this.setState(prev => ({
                    match: {
                        currentIndex: prev.match.currentIndex + 1,
                        quizzes: prev.match.quizzes,
                        numberOfQuizzes: prev.match.numberOfQuizzes
                    }
                }));
            }
        } else {
            this.setState({match: {defeat: true}});
        }
    };


    renderAnswerTag(prefix, answer, correct) {
        return <div className='answer' onClick={() => this.handleClick(correct)} tabIndex="0"> {prefix + answer} </div>;
    }

    /*
        Tabindex is important to add for universal design.
        Tabindex make html elements able to reach from the key tab.
        Like in this case where we use a <div></div> as a button.
        If we did not add tabindex inside the div, it would not have
        been possible to navigate to it with the keyboard.
        With tabindex we can also decide the order of the tab-able elements.
        As we now have it set to 0, we use default order.
        By giving them nr 1-2-3-4-5 we can decide the order, but this is considered bad practice.
         More info: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
    */

    render() {

        if(this.state.error){
            return <h2>{this.state.error}</h2>
        }

        if(!this.state.match){
            return<h2>Loading...</h2>
        }

        if(this.state.match.victory){
            return (
              <div className="game-result">
                  <h2 style={{color: "green"}}> Congrats, You Won!</h2>
                  <div className="action">
                      <button className="play-new-game-button" onClick={this.startNewMatch}>
                          New Match
                      </button>
                  </div>
              </div>
            );
        }

        if(this.state.match.defeat){
            return (
              <div className="game-result">
                  <h2 style ={{color: "red"}}>Sorry Wrong Answer, You Lost!</h2>
                  <div className="action">
                      <button className="play-new-game-button"
                              onClick={this.startNewMatch}>
                          New Match
                      </button>
                  </div>
              </div>
            );
        }

        const match = this.state.match;
        const count = "" + (match.currentIndex + 1) + "/" + match.numberOfQuizzes;
        const quiz = match.quizzes[match.currentIndex];

        return (

            <div id={"quiz_" + quiz.id} className="quiz">
                <p className="question">Question {count}: {quiz.question}{" "}</p>
                {this.renderAnswerTag("A: ", quiz.answers[0], quiz.indexOfRightAnswer === 0)}
                {this.renderAnswerTag("B: ", quiz.answers[1], quiz.indexOfRightAnswer === 1)}
                {this.renderAnswerTag("C: ", quiz.answers[2], quiz.indexOfRightAnswer === 2)}
                {this.renderAnswerTag("D: ", quiz.answers[3], quiz.indexOfRightAnswer === 3)}
            </div>
        );



        /*const quiz = this.state.quiz;

        return (
            /!*
            This <></> is a shorthand for React fragment.
            The full tag is <React.Fragment></React.Fragment>.
            Using a shorthand is just  easier/cleaner.
            It is useful when we dont want another html tag,
            like a div to be added to the html three but need something that collects other elements.
            Note: the "return" must return only a single tag (with possibly children), and not a list.
            If you look at this <></> from the development tools in your browser, it wont be visible.
            Doc: https://reactjs.org/docs/fragments.html
            *!/
            <>
                <p className='question'>Question: {quiz.question} </p>
                {this.renderAnswerTag("A: ", quiz.answers[0], quiz.indexOfRightAnswer === 0)}
                {this.renderAnswerTag("B: ", quiz.answers[1], quiz.indexOfRightAnswer === 1)}
                {this.renderAnswerTag("C: ", quiz.answers[2], quiz.indexOfRightAnswer === 2)}
                {this.renderAnswerTag("D: ", quiz.answers[3], quiz.indexOfRightAnswer === 3)}
            </>
        );*/
    }
}

export default withRouter(Match);