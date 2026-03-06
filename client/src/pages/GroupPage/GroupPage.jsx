import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import './GroupPage.css';
import { useLocation } from "react-router-dom";

function GroupPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  useEffect(() => {
    if (location.state?.showConfirm) {
      setShowConfirm(true);
    }
  }, [location.state]);
  const [groupName, setGroupName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState([]);
  const [groups, setGroups] = useState([]);

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
      const res = await axios.post(
        "http://localhost:5000/api/groups",
        { name: groupName, members },
        { withCredentials: true },
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
        const yourGroups = await axios.get("http://localhost:5000/api/groups", {
          withCredentials: true,
        });
        // console.log(yourGroups.data);
        setGroups(yourGroups.data);
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
      <div className="create-group-section">
        <button
          className="create-header"
          onClick={() => setShowConfirm(!showConfirm)}
        >
          + Create New Group
        </button>
      </div>
      <h2>Your Groups</h2>
      <div className="groups-grid">
        {groups.length === 0 ? (
          <p>No groups available</p>
        ) : (
          groups.map((group) => (
            <div
              className="group-card"
              key={group._id}
              onClick={() => handleClick(group._id)}
            >
              <div className="GroupTile">
                <span className="groupIcon">✈️</span>
                <span className="groupName">{group.name}</span>
              </div>
            </div>
          ))
        )}
        <Outlet />
      </div>
      {showConfirm && (
        <div className="create-body">
          <div className="card">
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
              <button onClick={handleAddMember}>Add</button>
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
              Save Group
            </button>
            <button
              className="cancel-btn"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupPage;
