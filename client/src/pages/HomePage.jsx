import axios from "axios";
import "../designs/home.css";
import { Link } from "react-router-dom";
import { MdOutlineGroupAdd } from "react-icons/md";
import { useState, useEffect } from "react";

function HomePage() {
  const [youOwe, setYouOwe] = useState(0);
  const [youAreOwed, setYouAreOwed] = useState(0);
  const [groups, setGroups] = useState([]);

  const findGroups = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/groups/", {
        withCredentials: true,
      });
      const summaryRes = await axios.get("http://localhost:5000/api/summary", {
        withCredentials: true,
      });
      setGroups(response.data);
      setYouOwe(summaryRes.data.youOwe);
      setYouAreOwed(summaryRes.data.youAreOwed);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    findGroups();
  }, []);

  return (
    <div className="homeContainer">
      <div className="mainCard">
        <div className="summary">
          <div className="totalSection">
            <p>Total Balance</p>
            <h2>₹{youAreOwed - youOwe}</h2>
          </div>

          <div className="splitSection">
            <div className="moneyBox receive">
              <p>You'll Receive</p>
              <h3>₹{youAreOwed}</h3>
            </div>

            <div className="moneyBox pay">
              <p>You'll Pay</p>
              <h3>₹{youOwe}</h3>
            </div>
          </div>
        </div>

        <div className="groups">
          <p>Your Groups</p>
          <div className="groupsGrid">
            <Link
              to="/groups"
              state={{ showConfirm: true }}
              className="createGroupBox"
            >
              <div className="groupLogo">
                <MdOutlineGroupAdd />
              </div>
              <div className="groupName">Create Group</div>
            </Link>
            {groups.length === 0 ? (
              <p>No groups found</p>
            ) : (
              groups.map((group) => (
                <div className="groupBox" key={group._id}>
                  <div className="groupLogo">✈️</div>
                  <div className="groupName">{group.name}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
