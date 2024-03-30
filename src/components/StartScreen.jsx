import React from "react";

const StartScreen = ({ totalQuestions, dispatch }) => {
  return (
    <div className="start">
      <h2>Welcome to the React Quiz!</h2>

      <h3>{totalQuestions} Questions to test your react mastery</h3>
      <p style={{ fontSize: "18px" }}>
        Select by Number of Questions or Difficulty Level :
      </p>
      <div className="startOptions">
        <p style={{ fontSize: "15px" }}>Number of Questions</p>
        <select
          className="btn btn-ui"
          onChange={(e) =>
            dispatch({
              type: "numOfQuestions",
              payLoad: Number(e.target.value),
            })
          }
        >
          <option>Select</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>{" "}
        <label style={{ fontSize: "15px" }}>Difficulty Level </label>
        <select
          className="btn btn-ui"
          onChange={(e) =>
            dispatch({ type: "difficulty", payLoad: e.target.value })
          }
        >
          {" "}
          <option>Select</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's Start
      </button>
    </div>
  );
};

export default StartScreen;
