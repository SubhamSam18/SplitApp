import axios from "axios";
import { useState, useEffect } from "react";
import "../designs/friends.css";

function Friends() {
  const [Friends, setFriends] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editableBalance, setEditableBalance] = useState("");

  const handleSelectClick = (user) => {
    setSelectedUser(user);
    setShowConfirm(true);
    setEditableBalance(user.balance);
  };

  const confirmSettle = async () => {
    // console.log("Settled with:", selectedUser.name);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/settle/friend",
        { to: selectedUser._id },
        {
          withCredentials: true,
        },
      );
    } catch (err) {
      console.log("Error while Settelling");
    }

    setShowConfirm(false);
    setSelectedUser(null);
  };

  const cancelSettle = () => {
    setShowConfirm(false);
    setSelectedUser(null);
  };

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
            <button
              className="settleUp"
              onClick={() => handleSelectClick(user)}
            >
              Settle Up
            </button>
          </div>
        ))}
      </div>
      {showConfirm && (
        <div className="ConfirmationPopup">
          <div className="popupBox" onClick={(e) => e.stopPropagation()}>
            <p>
              Are you sure you want to settle with?{" "}
              <strong>({selectedUser?.name})</strong>
              <br />
              This action cannot be reversed!
            </p>
            <input
              className="amountBox"
              type="number"
              value={editableBalance}
              onChange={(e) => setEditableBalance(e.target.value)}
            />
            <div className="popupButton">
              <button className="confirmButton" onClick={confirmSettle}>
                Yes
              </button>
              <button className="confirmButton" onClick={cancelSettle}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Friends;
