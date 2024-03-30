function Finished({
  points,
  maxPoints,
  highscore,
  dispatch,
  numOfQuestions,
  difficultyLevelQuestions,
  index,
}) {
  const percentage = (points / maxPoints) * 100;
  return (
    <>
      {" "}
      <p className="result">
        You scored <strong>{points}</strong> out of {maxPoints} ({" "}
        {Math.ceil(percentage)}% )
      </p>
      <p className="highscore">
        Highscore :{" "}
        {difficultyLevelQuestions[index]?.points === 10 && highscore.easy}
        {difficultyLevelQuestions[index]?.points === 20 && highscore.medium}
        {difficultyLevelQuestions[index]?.points === 30 && highscore.hard}
        {numOfQuestions === 5 &&
          difficultyLevelQuestions[index]?.points !== 30 &&
          highscore.fiveQues}
        {numOfQuestions === 10 && highscore.tenQues}
        {numOfQuestions === 15 && highscore.fifteenQues} Points
      </p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart
      </button>
    </>
  );
}

export default Finished;
