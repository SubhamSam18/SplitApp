import { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import API from "../../services/api";
import './GroupPage.css';
import { useLoading } from "../../context/LoadingContext";
import { motion, AnimatePresence } from "framer-motion";

function GroupPage() {
  const { stopLoading } = useLoading();
  const location = useLocation();
  const navigate = useNavigate();
  // Initialize from state immediately to prevent "flash" of background
  const [showConfirm, setShowConfirm] = useState(!!location.state?.showConfirm);
  const [groupName, setGroupName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // If we're coming from Home page with a "Create Group" transition,
    // we keep the loading screen up long enough to ensure everything is rendered
    if (location.state?.showConfirm) {
      setTimeout(() => {
        stopLoading();
      }, 400); // Wait for components to settle
    }
  }, [location.state, stopLoading]);

  const handleAddMember = () => {
    if (memberInput.trim()) {
      setMembers([...members, memberInput]);
      setMemberInput("");
    }
  };
  const handleRemoveMember = (index) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  const handleCreateGroup = async () => {
    try {
      const res = await API.post(
        "/groups",
        { name: groupName, members }
      );

      setGroups([...groups, res.data]);
      setGroupName("");
      setMembers([]);
      setShowConfirm(false);
    } catch (err) {
      if (err.response?.data?.invalidEmails) {
        alert("User not found:\n" + err.response.data.invalidEmails.join(", "));
      } else {
        alert("Something went wrong");
      }
    }
  };

  useEffect(() => {
    const findGroups = async () => {
      try {
        const yourGroups = await API.get("/groups");
        setGroups(yourGroups.data.groups);
      } catch (err) {
        console.log(err);
      }
    };
    findGroups();
  }, []);

  const handleClick = (groupId) => {
    navigate(`/groups/${groupId}/summary`);
  };

  return (
    <div className="groups-page">
      <div className="groups-header">
        <div className="header-content">
          <h1>Your Groups</h1>
          <p>Manage and track shared expenses with your teams</p>
        </div>
        <button
          className="create-group-btn"
          onClick={() => setShowConfirm(!showConfirm)}
        >
          <span className="plus-icon">+</span> Create New Group
        </button>
      </div>

      <div className="groups-grid">
        {groups.length === 0 ? (
          <div className="empty-groups">
            <p>No groups found. Create one to get started!</p>
          </div>
        ) : (
          groups.map((group) => (
            <div
              className="group-card"
              key={group._id}
              onClick={() => handleClick(group._id)}
            >
              <div className="card-glass-glow"></div>
              <div className="groupIcon">✈️</div>
              <div className="card-info">
                <h3>{group.name}</h3>
                <span className="view-summary">View Summary →</span>
              </div>
            </div>
          ))
        )}
        <Outlet />
      </div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="card"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="card-glass-glow"></div>
              <p className="group-heading">Create New Group</p>
              <input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <div className="member-row">
                <input
                  type="text"
                  placeholder="Add Member Email"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
                />
                <button className="add-member-btn" onClick={handleAddMember}>ADD</button>
              </div>
              <div className="member-list">
                {members.map((m, i) => (
                  <span key={i} className="member-tag">
                    {m}{" "}
                    <button
                      className="remove-member"
                      onClick={() => handleRemoveMember(i)}
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
              <button className="save-btn" onClick={handleCreateGroup}>
                Create Group
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GroupPage;
