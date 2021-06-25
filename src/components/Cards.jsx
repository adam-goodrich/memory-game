import { useEffect } from "react";

function Cards(props) {
  useEffect(() => {
    return props.setCardsInPlay(props.cardsInPlay);
  }, [props]);

  if (props.lost) {
    return (
      <div className="container">
        <div className="card">
          <div className="alert alert-danger">You Lose!</div>
        </div>
      </div>
    );
  } else if (props.win) {
    return (
      <div className="container">
        <div className="card">
          <div className="alert alert-success">You Win!</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container mt-3 mb-5">
        <div className="row">
          {props.cardsInPlay.map((_, index) => {
            while (index <= 7) {
              return (
                <div
                  key={`card-${index}`}
                  id={props.cardsInPlay[index].name}
                  className="col-md-3 col-6 d-flex align-items-stretch"
                  onClick={() => {
                    props.clickedDog(props.cardsInPlay[index].name);
                  }}>
                  <div className="card mt-3">
                    <img
                      src={props.cardsInPlay[index].img}
                      className="card-img-top"
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
