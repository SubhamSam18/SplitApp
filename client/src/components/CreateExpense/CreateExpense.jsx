import { useEffect, useState } from "react";
import API from "../../services/api";
import "./CreateExpense.css";

function CreateExpense({ groupId, members, currentUserId, onClose, onSave, selectedExpense }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [paidBy, setPaidBy] = useState(currentUserId);
  const [splitAmount, setSplitAmount] = useState({});
  const [selectedUsers, setSelectedUsers] = useState(
    members ? members.map((m) => m.userId) : []
  );

  useEffect(() => {
    if (selectedExpense) {
      setDescription(selectedExpense.description);
      setAmount(selectedExpense.amount);
      setSplitType(selectedExpense.splitType);
      setPaidBy(selectedExpense.paidBy);
      const splitAmounts = selectedExpense.splits.reduce((acc, split) => {
        acc[split.user] = split.amount || 0;
        return acc;
      }, {});
      setSplitAmount(splitAmounts);
      setSelectedUsers(selectedExpense.splits.map((s) => s.user));
    }
  }, [selectedExpense, members]);

  const handleUserToggle = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const getCalculatedSplit = (userId) => {
    if (splitType === "equal") {
      if (!selectedUsers.includes(userId) || selectedUsers.length === 0) return 0;
      return (parseFloat(amount) || 0) / selectedUsers.length;
    }
    return splitAmount[userId] || 0;
  };

  const handleClick = async () => {
    let splits = [];
    if (splitType == "equal") {
      splits = members
        .filter((member) => selectedUsers.includes(member.userId))
        .map((member) => ({
          user: member.userId,
          name: member.name,
          amount: parseFloat(amount) / selectedUsers.length,
        }));
    } else if (splitType == "exact") {
      splits = members
        .filter((member) => selectedUsers.includes(member.userId))
        .map((member) => ({
          user: member.userId,
          amount: splitAmount[member.userId] || 0,
          name: member.name,
        }));
    }

    const expenseData = {
      groupId,
      description,
      amount: parseFloat(amount),
      splitType,
      splits,
      paidBy,
    };

    // console.log("Expense Data:", expenseData);

    try {
      if (selectedExpense) {
        await API.put(
          `/expense/${selectedExpense._id}`,
          { data: expenseData }
        );
      } else {
        await API.post(
          "/expense",
          { data: expenseData }
        );
      }
      // console.log("Expense processed");
      if (onSave) onSave();
      else onClose();
    } catch (error) {
      console.error("Error creating expense:", error);
      alert(error.response?.data?.message || "Failed to create expense");
    }
  };

  return (
    <div className="createExpenseCard">
      <div className="creatCard">
        <div className="card-glass-glow"></div>
        <h2>{selectedExpense ? "Edit Expense" : "Add New Expense"}</h2>
        <div className="expenseDescription">
          <input
            type="text"
            className="expenseDesc"
            placeholder="Add Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="expenseAmount">
          <input
            type="number"
            className="expenseAmt"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="expenseType">
          <select
            className="expenseSelect"
            value={splitType}
            onChange={(e) => setSplitType(e.target.value)}
          >
            <option value="equal">Equal</option>
            <option value="exact">Exact</option>
          </select>
        </div>
        <div className="paidBySelect">
          <select
            className="paidByUser"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
          >
            {members &&
              members.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.name}
                </option>
              ))}
          </select>
        </div>

        <div className="saveExpense">
          <button className="saveButton" onClick={handleClick}>Save Expense</button>
          <button className="closeButton" onClick={onClose}>Discard</button>
        </div>
      </div>
      <div className="userList">
        {members.map((member) => (
          <div
            key={member.userId}
            className={`userItem ${
              selectedUsers.includes(member.userId) ? "selected" : ""
            }`}
            onClick={() => handleUserToggle(member.userId)}
          >
            <div className="card-glass-glow"></div>
            <div className="userAvatar">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div className="userInfo">
              <span className="userName">{member.name}</span>
              {selectedUsers.includes(member.userId) && (
                <span className="calculatedAmount">
                  ₹{getCalculatedSplit(member.userId).toFixed(2)}
                </span>
              )}
            </div>
            {splitType === "exact" && selectedUsers.includes(member.userId) && (
              <input
                type="number"
                className="splitAmount"
                value={splitAmount[member.userId] || ""}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  setSplitAmount((other) => ({
                    ...other,
                    [member.userId]: Number(e.target.value),
                  }));
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreateExpense;
