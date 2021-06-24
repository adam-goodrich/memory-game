function Cards(props) {
  return (
    <div className="container mt-3 mb-5">
      <div className="row">
        {props.cards.map((item, index) => {
          return (
            <div className="col-sm-3 col-6 d-flex align-items-stretch">
              <div className="card mt-3">
                <img
                  src={props.cards[index].img}
                  className="card-img-top"
                  alt="bulldog"
                />
                <div className="card-body">
                  <h5 className="card-title">{props.cards[index].name}</h5>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Cards;
