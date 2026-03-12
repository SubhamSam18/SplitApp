import API from "../../services/api";
import "./HomePage.css";
import { Link } from "react-router-dom";
import { MdOutlineGroupAdd } from "react-icons/md";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountOptions from "../../components/AccountOptions/AccountOptions";
import { motion, AnimatePresence } from "framer-motion";

function HomePage() {
  const [youOwe, setYouOwe] = useState(0);
  const [youAreOwed, setYouAreOwed] = useState(0);
  const [groups, setGroups] = useState([]);
  const [accountOption, setAccountOption] = useState(false);
  const [accountDetails, setAccountDetails] = useState([]);
  const navigate = useNavigate();

  const findGroups = async () => {
    try {
      const response = await API.get("/groups/");
      const summaryRes = await API.get("/summary");
      setAccountDetails(response.data.user);
      setGroups(response.data.groups.reverse());
      setYouOwe(summaryRes.data.youOwe);
      setYouAreOwed(summaryRes.data.youAreOwed);
    } catch (err) {
      console.log(err);
    }
  };
  const handleClick = (groupId) => {
    navigate(`/groups/${groupId}/summary`);
  };
  useEffect(() => {
    findGroups();
  }, []);

  return (
    <div className="homeContainer">
      <div className="userAccount">
        <motion.div
          className="userProfile"
          animate={{
            paddingTop: accountOption ? "20px" : "0px",
            paddingBottom: accountOption ? "20px" : "0px",
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="userImage">
            <img
              onClick={() => {
                setAccountOption(!accountOption);
              }}
              src="https://w0.peakpx.com/wallpaper/419/208/HD-wallpaper-face-art-abstract-face-painting-profile.jpg"
              alt=""
            />
          </div>
          <div className="accOptions">
            <AnimatePresence>
              {accountOption && (
                <motion.div
                  className="accountDropdown"
                  initial={{ height: 0, opacity: 0, scale: 0.95 }}
                  animate={{ height: "auto", opacity: 1, scale: 1 }}
                  exit={{ height: 0, opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <AccountOptions userDetails={accountDetails} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      <div className="mainCard">
        <div className="card-glass-glow"></div>
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
                <div
                  className="groupBox"
                  key={group._id}
                  onClick={() => handleClick(group._id)}
                >
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