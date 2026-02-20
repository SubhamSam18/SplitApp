import { useState, useEffect } from "react";
import axios from "axios";
import "../designs/group.css";

function Groups() {
  const [isOpen, setIsOpen] = useState(false);
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
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const findGroups = async () => {
      try {
        const yourGroups = await axios.get("http://localhost:5000/api/groups", {
          withCredentials: true,
        });
        console.log(yourGroups.data);
        setGroups(yourGroups.data);
      } catch (err) {
        console.log(err);
      }
    };
    findGroups();
  }, []);

  return (
    <div className="groups-page">
      <div className="create-group-section">
        <div className="create-header" onClick={() => setIsOpen(!isOpen)}>
          + Create New Group
        </div>

        {isOpen && (
          <div className="create-body">
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
              />
              <button onClick={handleAddMember}>Add</button>
            </div>

            <div className="member-list">
              {members.map((m, i) => (
                <span key={i} className="member-tag">
                  {m}
                </span>
              ))}
            </div>

            <button className="save-btn" onClick={handleCreateGroup}>
              Save Group
            </button>
          </div>
        )}
      </div>

      <div className="groups-grid">
        {groups.length === 0 ? (
          <p>No groups available</p>
        ) : (
          groups.map((group) => (
            <div className="group-card" key={group._id}>
              {group.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Groups;
