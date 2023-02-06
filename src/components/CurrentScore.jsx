function CurrentScore(props) {
  return (
    <div className="container">
      <div className="m-1">Welcome: {props.name}</div>
      <div className="m-1">Current Score: {props.score}</div>
    </div>
  );
}

export default CurrentScore;
