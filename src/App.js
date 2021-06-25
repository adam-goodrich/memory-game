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

  useEffect(() => {
    const highScoreUpdater = () => {
      if (score > highScore) {
        setHighScore(score);
      }
    };

    highScoreUpdater();
  }, [highScore, score, cards, chosenDogs]);

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
    const randomCards = shuffle(cards);
    setCards(randomCards);
    if (chosenDogs.filter((e) => e === dogName).length > 0) {
      console.log("Already Clicked! You Lose");
      setScore(0);
      setCards(dogList);
      setChosenDogs([]);
    } else {
      setChosenDogs(chosenDogs.concat(dogName));
      setScore(score + 1);
      let newCards = [...cards];
      setCards(newCards.filter((val) => val.name !== dogName));
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
      <Cards cards={cards} clickedDog={clickedDog} />
    </div>
  );
}

export default App;
