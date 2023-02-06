import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";
import { useEffect, useState } from "react";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const getLeaderboard = async () => {
      const collectionRef = collection(db, "users");
      const snapshot = await getDocs(collectionRef);
      const data = snapshot.docs.map((doc) => doc.data());
      const sortedData = data.sort((a, b) => b.highScore - a.highScore);
      setLeaderboard(sortedData);
    };
    getLeaderboard();
  }, []);

  return (
    <div className="leaderboard">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Leaderboard</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Name</th>
                  <th scope="col">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, index) => {
                  if (index < 10) {
                    return (
                      <tr key={user.name}>
                        <th scope="row">{index + 1}</th>
                        <td>{user.name}</td>
                        <td>{user.highScore}</td>
                      </tr>
                    );
                  } else {
                    return false;
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
