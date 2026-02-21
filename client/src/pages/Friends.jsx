import axios from "axios";
import { useState, useEffect } from "react";
import "../designs/friends.css";

function Friends() {
  const [Friends, setFriends] = useState([]);
  useEffect(() => {
    const getFriends = async () => {
      try {
        const friends = await axios.get("http://localhost:5000/api/friends", {
          withCredentials: true,
        });
        // console.log(friends.data);
        setFriends(friends.data);
      } catch (err) {
        alert("No friends Found");
      }
    };
    getFriends();
  }, []);

  return (
    <div className="friendsPage">
      <div className="users">
        {Friends.map((user) => (
          <div key={user._id} className="userContainer">
            <div className="user">{user.name}</div>
            <div
              className={`balanceBox ${
                user.balance > 0
                  ? "positive"
                  : user.balance < 0
                    ? "negative"
                    : "neutral"
              }`}
            >
              ₹{user.balance}
            </div>
            <button className="settleUp">Settle Up</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Friends;
