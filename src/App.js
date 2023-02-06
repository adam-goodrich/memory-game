import { useState, useEffect } from "react";
import "./App.css";
import Cards from "./components/Cards";
import dogList from "./components/dogList";
import ClipLoader from "react-spinners/ClipLoader";
import Footer from "./components/Footer";
import { db } from "./firebase.config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  addDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import Leaderboard from "./components/Leaderboard";

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
  const [lastClickedDog, setLastClickedDog] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [login, setLogin] = useState(false);
  const [createUser, setCreateUser] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [currenDocId, setcurrentDocId] = useState(null);

  let auth = getAuth();
  const collectionRef = collection(db, "users");

  useEffect(() => {
    const highScoreUpdater = () => {
      if (score > highScore) {
        setHighScore(score);
        // write to firebase
        const currentDoc = doc(db, "users", currenDocId);
        updateDoc(currentDoc, {
          highScore: score,
        });
      }
    };

    highScoreUpdater();
  }, [highScore, score, currenDocId]);

  useEffect(() => {
    const images = [];
    dogList.map((object) => {
      return images.push(object.img);
    });

    cacheImages(images);
  });

  useEffect(() => {
    setCards(shuffle(cards));
  }, [setCards, cards]);

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

  const handleCreateUser = async (auth, email, password, name) => {
    // validate email and password
    if (email === "" || password === "" || name === "") {
      alert("Please fill out all fields");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    // email validation
    const emailRegex = new RegExp(
      "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$"
    );
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password).catch(
        (error) => {
          console.log(error);
        }
      );
      await updateProfile(auth.currentUser, { displayName: name }).catch(
        (error) => {
          console.log(error);
        }
      );
      await addDoc(collectionRef, {
        name: name,
        email: email,
        highScore: highScore,
        uid: auth.currentUser.uid,
      }).catch((error) => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
    setLoggedIn(true);
    setCreateUser(false);
    setName(auth.currentUser.displayName);
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach((doc) => {
      if (doc.data().uid === auth.currentUser.uid) {
        setHighScore(doc.data().highScore);
        setcurrentDocId(doc.id);
      }
    });
  };

  const handleLogin = async (auth, email, password) => {
    // validate email and password
    if (email === "" || password === "") {
      alert("Please fill out all fields");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Incorrect email or password");
      setEmail("");
      setPassword("");
      return;
    }

    // set highscore on firebase user to highscore
    // get all documents in collection
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach((doc) => {
      if (doc.data().uid === auth.currentUser.uid) {
        setHighScore(doc.data().highScore);
        setcurrentDocId(doc.id);
        setLoggedIn(true);
        setName(auth.currentUser.displayName);
        setLogin(false);
      }
    });
    if (email === "" || password === "") {
      return;
    }
  };

  if (login) {
    return (
      <div className="App">
        <div className="login-container">
          <div className="login-form">
            <h1 className="login-title">Login</h1>
            <form>
              <label className="login-label mt-3" htmlFor="email">
                Email
                <br />
                <input
                  type="text"
                  placeholder="Email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </label>
              <br />

              <label className="login-label mt-3" htmlFor="password">
                Password
                <br />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </label>
              <br />

              <button
                className="btn btn-success mt-3"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogin(auth, email, password);
                }}>
                Login
              </button>
              <br />
            </form>
            <button
              className="btn btn-primary mt-5"
              onClick={() => {
                setLogin(false);
                setCreateUser(true);
              }}>
              Don't have an account? Create one here!
            </button>
          </div>
        </div>
        <div className="leaderboardContainer mt-5">
          <Leaderboard />
        </div>
      </div>
    );
  }

  if (createUser) {
    return (
      <div className="App">
        <div className="createUser-container">
          <div className="createUser-form">
            <h1 className="createUser-title">Create Account</h1>
            <form className="form-group">
              <label className="createUser-label mt-2" htmlFor="name">
                Name
                <br />
                <input
                  className="form-control"
                  type="text"
                  placeholder="Name"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </label>
              <br />
              <label className="createUser-label mt-2" htmlFor="email">
                Email
                <br />
                <input
                  className="form-control"
                  type="text"
                  placeholder="Email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
              </label>
              <br />

              <label className="createUser-label mt-2" htmlFor="password">
                Password
                <br />
                <input
                  className="form-control"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <br />

              <button
                className="btn btn-primary mt-3"
                onClick={(e) => {
                  e.preventDefault();
                  handleCreateUser(auth, email, password, name);
                  setName("");
                  setEmail("");
                  setPassword("");
                }}>
                Create Account
              </button>
            </form>
            <button
              className="btn btn-success btn-lg mt-5"
              onClick={() => {
                setCreateUser(false);
                setLogin(true);
              }}>
              Already have an account? Login here
            </button>
          </div>
        </div>
        <div className="leaderboardContainer mt-5">
          <Leaderboard />
        </div>
      </div>
    );
  }

  if (loggedIn) {
    if (isLoading) {
      return (
        <div className="flex-container mt-5">
          <div className="spinner-div mt-5">
            <ClipLoader color="yellow" size="100px" />
          </div>
        </div>
      );
    }
    return (
      <div className="App ">
        <div className="mt-3 mb-3">
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
            setIsLoading={setIsLoading}
            score={score}
            name={name}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="App">
        <div className="container mt-5 ">
          <div className="container d-flex align-items-center justify-content-center title-card">
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
                    setLoggedIn(true);
                    setIsLoading(true);
                  }}>
                  Start Game
                </button>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
