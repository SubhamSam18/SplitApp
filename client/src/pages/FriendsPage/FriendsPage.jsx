import axios from "axios";
import { useState, useEffect } from "react";
import './FriendsPage.css';
import { motion, AnimatePresence } from "framer-motion";

function FriendsPage() {
  const [Friends, setFriends] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [Balance, setBalance] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectClick = (user) => {
    setSelectedUser(user);
    setShowConfirm(true);
    setBalance(user.balance);
  };

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

  const confirmSettle = async () => {
    // console.log("Settled with:", selectedUser.name);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/settle/friend",
        {
          to: selectedUser._id,
        },
        {
          withCredentials: true,
        },
      );
      await getFriends();
    } catch (err) {
      console.log("Error while Settling");
    }

    setShowConfirm(false);
    setSelectedUser(null);
  };

  const cancelSettle = () => {
    setShowConfirm(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <>
      <div className="friendsPage">
        <div className="friendsHeader">
          <h2>Friends</h2>
          <p>Track and settle balances with your friends</p>
        </div>

        {Friends.length === 0 ? (
          <div className="emptyState">
            <h3>No friends available</h3>
            <p>Create a group to start splitting expenses.</p>
          </div>
        ) : (
          <div className="friend">
            <div className="searchFriend">
              <span className="search-icon">⌕</span>
              <input
                type="text"
                placeholder="Search Friend"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="users">
              <AnimatePresence>
                {Friends.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
                  <motion.div
                    key={user._id}
                    className="userContainer"
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="user">{user.name}</div>
                    <div
                      className={`balanceBox ${user.balance > 0
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
                  </motion.div>
                ))}</AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            className="ConfirmationPopup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cancelSettle}
          >
            <motion.div 
              className="popupBox" 
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <p>
                Are you sure you want to settle with?{" "}
                <strong>({selectedUser?.name})</strong>
                <br />
                This action cannot be reversed!
              </p>
              <div className="amountBox">
                <input type="text" readOnly value={`₹${Balance}`} />
              </div>
              <div className="popupButton">
                <button onClick={confirmSettle}>
                  Yes, Settle Up
                </button>
                <button onClick={cancelSettle}>
                  No, Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default FriendsPage;
