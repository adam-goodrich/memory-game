import { useState, useEffect } from "react";
import "./App.css";
import CurrentScore from "./components/CurrentScore";
import HighScore from "./components/HighScore";
import Cards from "./components/Cards";
import dogList from "./components/dogList";
import ClipLoader from "react-spinners/ClipLoader";

function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [cards, setCards] = useState(dogList);
  const [chosenDogs, setChosenDogs] = useState([]);
  const [alreadyClicked, setAlreadyClicked] = useState([]);
  const [cardsInPlay, setCardsInPlay] = useState(dogList);
  const [lost, setLost] = useState(false);
  const [win, setWin] = useState(false);
  const [savedScore, setSavedScore] = useState(0);
  const [startGame, setStartGame] = useState(false);
  const [lastClickedDog, setLastClickedDog] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const highScoreUpdater = () => {
      if (score > highScore) {
        setHighScore(score);
      }
    };

    highScoreUpdater();
  }, [highScore, score]);

  useEffect(() => {
    const images = [];
    dogList.map((object) => {
      return images.push(object.img);
    });

    cacheImages(images);
  });

  const cacheImages = async (srcArray) => {
    const promises = await srcArray.map((src) => {
      return new Promise(function (resolve, reject) {
        const img = new Image();

        img.src = src;
        img.onload = resolve();
        img.onerror = reject();
      });
    });

    await Promise.all(promises);
    await new Promise((r) => setTimeout(r, 2000));

    setIsLoading(false);
  };

  const shuffle = (array) => {
    let currentIndex = array.length;
    let randomIndex;

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
    setLastClickedDog(dogName);
    let newCards = [...cards];
    let currentCards = newCards.filter((val) => val.name !== dogName);
    let currentAlreadyClicked = alreadyClicked.concat(
      newCards.filter((val) => val.name === dogName)
    );
    setCards(shuffle(currentCards));
    setAlreadyClicked(shuffle(currentAlreadyClicked));
    if (chosenDogs.filter((e) => e === dogName).length > 0) {
      setSavedScore(score);
      setScore(0);
      setCards(dogList);
      setChosenDogs([]);
      setCardsInPlay(shuffle(dogList));
      setAlreadyClicked([]);
      setLost(true);
    } else {
      setChosenDogs(chosenDogs.concat(dogName));
      if (score === dogList.length - 1) {
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
            if (i >= 11) {
              break;
            } else {
              newCardsInPlay.push(currentAlreadyClicked[i]);
            }
          }
          for (let i = 0; newCardsInPlay.length < 12; i++) {
            newCardsInPlay.push(currentCards[i]);
          }
          setCardsInPlay(shuffle(newCardsInPlay));
        }
      };
      deckBuilder();
    }
  };

  if (startGame) {
    if (isLoading) {
      return (
        <div className="spinner-div>">
          <ClipLoader />
        </div>
      );
    }
    return (
      <div className="App ">
        <div className="container score m-1 mt-3 ">
          <div
            className="alert alert-warning outline"
            style={{ height: "fit-content", width: "fit-content" }}>
            <div className="mt">
              <CurrentScore score={score} />
              <HighScore highScore={highScore} />
            </div>
          </div>
        </div>
        <Cards
          cards={cards}
          clickedDog={clickedDog}
          alreadyClicked={alreadyClicked}
          cardsInPlay={cardsInPlay}
          setCardsInPlay={setCardsInPlay}
          lost={lost}
          setLost={setLost}
          win={win}
          setWin={setWin}
          savedScore={savedScore}
          highScore={highScore}
          setScore={setScore}
          setCards={setCards}
          setChosenDogs={setChosenDogs}
          setAlreadyClicked={setAlreadyClicked}
          shuffle={shuffle}
          dogList={dogList}
          lastClickedDog={lastClickedDog}
        />
      </div>
    );
  } else {
    return (
      <div className="App">
        <div className="container mt-5 ">
          <div className="container d-flex align-items-center justify-content-center">
            <div
              className="alert alert-info outline p-5"
              style={{ height: "fit-content" }}>
              <h1 className="mt-5">Never Forget a Dog!</h1>

              <h2 className="mt-5">Click a dog you like!</h2>
              <h2>Don't click on a dog you already clicked or you lose.</h2>
              <h3 className="mt-5">How many dogs can you get?</h3>
              <h3 className="mt-2">Can you get them all?</h3>

              <div className="container mt-5 mb-5">
                <button
                  className="btn btn-success btn-lg"
                  onClick={() => {
                    setStartGame(true);
                  }}>
                  Start Game
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
