function Progress({
  index,
  numQuestions,
  points,
  maxPoints,
  answer,
  dispatch,
}) {
  return (
    <header className="progress">
      <progress
        max={numQuestions}
        value={index + Number(answer !== null)}
      ></progress>
      <p>
        Question <strong>{index + 1} </strong> / {numQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {maxPoints}
      </p>{" "}
      <button
        disabled={index === 0}
        className="btn btn-ui"
        style={{ width: "70px" }}
        title="show previous question"
        onClick={() =>
          dispatch({ type: "toggleQuestion", payLoad: "showPrevious" })
        }
      >
        &larr;
      </button>
      <button
        disabled={index === numQuestions - 1}
        className="btn btn-ui"
        style={{ width: "70px" }}
        title="show next question"
        onClick={() =>
          dispatch({ type: "toggleQuestion", payLoad: "showNext" })
        }
      >
        &rarr;
      </button>
    </header>
  );
}

export default Progress;
