import React, { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import Finished from "./components/Finished";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  // "loading", "error","ready","active","finished"
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: {
    easy: 0,
    medium: 0,
    hard: 0,
    fiveQues: 0,
    tenQues: 0,
    fifteenQues: 0,
    all: 0,
  },
  secondsRemaining: null,
  numOfQuestions: 0,
  difficultyLevelQuestions: [],
  answersArr: [],
  showNextBtn: true,
};
const newHighscore = JSON.parse(localStorage.getItem("highscore"));

function reducer(state, action) {
  if (state.difficultyLevelQuestions[state.index]?.points === 10) {
    newHighscore.easy =
      state?.points > newHighscore.easy ? state?.points : newHighscore.easy;
  } else if (state.difficultyLevelQuestions[state.index]?.points === 20) {
    newHighscore.medium =
      state?.points > newHighscore.medium ? state?.points : newHighscore.medium;
  } else if (state.difficultyLevelQuestions[state.index]?.points === 30) {
    newHighscore.hard =
      state?.points > newHighscore.hard ? state?.points : newHighscore.hard;
  } else if (state.numOfQuestions === 5) {
    newHighscore.fiveQues =
      state?.points > newHighscore.fiveQues
        ? state?.points
        : newHighscore.fiveQues;
  } else if (state.numOfQuestions === 10) {
    newHighscore.tenQues =
      state?.points > newHighscore.tenQues
        ? state?.points
        : newHighscore.tenQues;
  } else if (state.numOfQuestions === 15) {
    newHighscore.fifteenQues =
      state?.points > newHighscore.fifteenQues
        ? state?.points
        : newHighscore.fifteenQues;
  }
  switch (action.type) {
    case "dataReceived":
      // console.log(state.highscore);
      return {
        ...state,
        questions: action.payLoad,
        status: "ready",
        highscore: state.highscore,
      };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining:
          state.difficultyLevelQuestions?.slice(
            0,
            state.numOfQuestions || state.difficultyLevelQuestions.length
          ).length * SECS_PER_QUESTION ||
          state.questions.slice(
            0,
            state.numOfQuestions || state.questions.length
          ).length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question =
        state.difficultyLevelQuestions.length !== 0
          ? state.difficultyLevelQuestions.at(state.index)
          : state.questions.at(state.index);
      return {
        ...state,
        answer: action.payLoad,
        answersArr: [...state.answersArr, action.payLoad],
        points:
          action.payLoad === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer:
          state.answersArr.at(state.index + 1) === undefined
            ? null
            : state.answersArr.at(state.index + 1),
      };
    case "finished":
      localStorage.setItem("highscore", JSON.stringify(state.highscore));
      return {
        ...state,
        status: "finished",
        highscore: { ...state.highscore, ...newHighscore },
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        highscore: state.highscore,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
        highscore: { ...state.highscore, ...newHighscore },
      };
    case "numOfQuestions":
      return {
        ...state,
        numOfQuestions: action.payLoad,
      };
    case "difficulty":
      let questionsWithDifficultyLevel = [];
      if (action.payLoad === "easy") {
        questionsWithDifficultyLevel = state.questions.filter(
          (question) => question.points === 10
        );
      }
      if (action.payLoad === "medium") {
        questionsWithDifficultyLevel = state.questions.filter(
          (question) => question.points === 20
        );
      }
      if (action.payLoad === "hard") {
        questionsWithDifficultyLevel = state.questions.filter(
          (question) => question.points === 30
        );
      }
      if (action.payLoad === "all") {
        questionsWithDifficultyLevel = state.questions;
      }
      return {
        ...state,
        difficultyLevelQuestions: questionsWithDifficultyLevel,
        numOfQuestions: questionsWithDifficultyLevel.length,
      };

    case "toggleQuestion":
      let newIndex = 0;
      let newAnswer = null;
      if (action.payLoad === "showPrevious") {
        newIndex = state.index - 1;
        newAnswer = state.answersArr.at(state.index - 1);
      }
      if (action.payLoad === "showNext") {
        newIndex = state.index + 1;
        newAnswer = state.answersArr.at(state.index + 1);
      }

      return {
        ...state,
        index: newIndex,
        answer: newAnswer === undefined ? null : newAnswer,
        showNextBtn: false,
      };
    default:
      throw new Error("Action unknown");
  }
}

const App = () => {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      numOfQuestions,
      difficultyLevelQuestions,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  // console.log(highscore);
  const totalQuestions = questions.length;
  const maxPoints =
    difficultyLevelQuestions.length !== 0
      ? difficultyLevelQuestions
          ?.slice(0, numOfQuestions || difficultyLevelQuestions.length)
          .reduce((prev, cur) => {
            // console.log(prev, cur.points);
            return prev + cur.points;
          }, 0)
      : questions
          ?.slice(0, numOfQuestions || questions.length)
          .reduce((prev, cur) => {
            // console.log(prev, cur.points);
            return prev + cur.points;
          }, 0);

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payLoad: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            totalQuestions={numOfQuestions || totalQuestions}
            dispatch={dispatch}
          />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numOfQuestions ? numOfQuestions : totalQuestions}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
              dispatch={dispatch}
            />
            <Question
              question={
                difficultyLevelQuestions.length !== 0
                  ? difficultyLevelQuestions[index]
                  : questions[index]
              }
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />

              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numOfQuestions ? numOfQuestions : totalQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <Finished
            difficultyLevelQuestions={difficultyLevelQuestions}
            numOfQuestions={numOfQuestions}
            maxPoints={maxPoints}
            points={points}
            highscore={highscore}
            dispatch={dispatch}
            index={index}
          />
        )}
      </Main>
    </div>
  );
};

export default App;
