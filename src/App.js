import { useState, useEffect } from "react";
import "./App.css";
import CurrentScore from "./components/CurrentScore";
import HighScore from "./components/HighScore";
import Cards from "./components/Cards";
import dogList from "./components/dogList";

function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [cards, setCards] = useState(dogList);
  const [chosenDogs, setChosenDogs] = useState([]);
  const [alreadyClicked, setAlreadyClicked] = useState([]);
  const [cardsInPlay, setCardsInPlay] = useState(dogList);
  const [lost, setLost] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    const highScoreUpdater = () => {
      if (score > highScore) {
        setHighScore(score);
      }
    };

    highScoreUpdater();
    console.table(alreadyClicked);
  }, [highScore, score, cards, chosenDogs, alreadyClicked, cardsInPlay]);

  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  const clickedDog = (dogName) => {
    let newCards = [...cards];
    let currentCards = newCards.filter((val) => val.name !== dogName);
    let currentAlreadyClicked = alreadyClicked.concat(
      newCards.filter((val) => val.name === dogName)
    );
    setCards(shuffle(currentCards));
    setAlreadyClicked(shuffle(currentAlreadyClicked));
    if (chosenDogs.filter((e) => e === dogName).length > 0) {
      console.log("Already Clicked! You Lose");
      setScore(0);
      setCards(dogList);
      setChosenDogs([]);
      setCardsInPlay(shuffle(dogList));
      setAlreadyClicked([]);
      setLost(true);
    } else {
      setChosenDogs(chosenDogs.concat(dogName));
      if (score === 10) {
        console.log("You Win!");
        setWin(true);
        setScore(score + 1);
        return;
      }
      setScore(score + 1);

      const deckBuilder = () => {
        if (alreadyClicked.length === 0) {
          setCardsInPlay(shuffle(cardsInPlay));
        } else {
          let newCardsInPlay = [];
          for (let i = 0; i < currentAlreadyClicked.length; i++) {
            if (i >= 7) {
              break;
            } else {
              newCardsInPlay.push(currentAlreadyClicked[i]);
            }
          }
          for (let i = 0; newCardsInPlay.length < 8; i++) {
            newCardsInPlay.push(currentCards[i]);
          }
          setCardsInPlay(shuffle(newCardsInPlay));
        }
      };
      deckBuilder();
    }
  };

  return (
    <div className="App">
      <h2 className="mt-4">Don't forget a dog!</h2>
      <div className="container" style={{ width: "200px" }}>
        <div className="">
          <CurrentScore score={score} />
          <HighScore highScore={highScore} />
        </div>
      </div>
      <Cards
        cards={cards}
        clickedDog={clickedDog}
        alreadyClicked={alreadyClicked}
        cardsInPlay={cardsInPlay}
        setCardsInPlay={setCardsInPlay}
        lost={lost}
        win={win}
      />
    </div>
  );
}

export default App;
