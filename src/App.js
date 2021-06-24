import { useState, useEffect } from "react";
import "./App.css";
import CurrentScore from "./components/CurrentScore";
import HighScore from "./components/HighScore";
import Cards from "./components/Cards";
import bulldog from "./images/bulldog.jpeg";
import corgi from "./images/corgi.jpeg";
import germanShepherd from "./images/germanShepherd.jpeg";
import labrador from "./images/labrador.jpg";

function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [cards, setCards] = useState([
    {
      img: bulldog,
      name: "Bulldog",
    },
    {
      img: corgi,
      name: "Corgi",
    },
    {
      img: germanShepherd,
      name: "German Shepherd",
    },
    {
      img: labrador,
      name: "Labrador",
    },
    {
      img: bulldog,
      name: "Bulldog",
    },
    {
      img: corgi,
      name: "Corgi",
    },
    {
      img: germanShepherd,
      name: "German Shepherd",
    },
    {
      img: labrador,
      name: "Labrador",
    },
  ]);

  return (
    <div className="App">
      <h2 className="mt-4">Don't forget a dog!</h2>
      <CurrentScore score={score} />
      <HighScore highScore={highScore} />
      <Cards cards={cards} />
    </div>
  );
}

export default App;
