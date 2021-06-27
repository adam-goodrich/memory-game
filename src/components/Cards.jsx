import { useEffect } from "react";

function Cards(props) {
  if (props.lost) {
    return (
      <div className="container mt-5">
        <div className="container d-flex align-items-center justify-content-center ">
          <div
            className="alert alert-danger outline p-5"
            style={{ height: "fit-content" }}>
            <h1>You Lose!</h1>
            <h2 className="mt-5">
              You already clicked {props.lastClickedDog}.
            </h2>
            <h2 className="mt-5">Your score was {props.savedScore}.</h2>
            <h2>
              {props.savedScore === props.highScore
                ? "New High Score!"
                : `Can you beat the high score of ${props.highScore}?`}
            </h2>
            <div className="container mt-5 mb-5">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  props.setLost(false);
                  props.setScore(0);
                  props.setCards(props.dogList);
                  props.setChosenDogs([]);
                  props.setCardsInPlay(props.shuffle(props.dogList));
                  props.setAlreadyClicked([]);
                }}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (props.win) {
    return (
      <div className="container mt-5">
        <div className="container d-flex align-items-center justify-content-center ">
          <div
            className="alert alert-success outline p-5"
            style={{ height: "fit-content" }}>
            <h1>You Win!</h1>

            <h2 className="mt-5">You clicked every dog!</h2>
            <h3 className="mt-5">
              Wow, that is pretty impressive. You have an excellent memory.
              There are a total of {props.dogList.length} dogs in this game and
              you remembered them all!
            </h3>

            <div className="container mt-5 mb-5">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  props.setWin(false);
                  props.setScore(0);
                  props.setCards(props.dogList);
                  props.setChosenDogs([]);
                  props.setCardsInPlay(props.shuffle(props.dogList));
                  props.setAlreadyClicked([]);
                }}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container mb-5">
        <div className="row">
          {props.cardsInPlay.map((_, index) => {
            while (index <= 11) {
              return (
                <div
                  key={`card-${index}`}
                  id={props.cardsInPlay[index].name}
                  className="col-xl-2 col-md-3 col-6 d-flex align-items-stretch "
                  onClick={() => {
                    props.clickedDog(props.cardsInPlay[index].name);
                  }}>
                  <div className="card mt-3">
                    <img
                      src={props.cardsInPlay[index].img}
                      className="card-img-top embed-responsive-item"
                      alt="bulldog"
                    />
                    <div className="card-body">
                      <h5 className="card-title">
                        {props.cardsInPlay[index].name}
                      </h5>
                    </div>
                  </div>
                </div>
              );
            }
            return true;
          })}
        </div>
      </div>
    );
  }
}

export default Cards;
