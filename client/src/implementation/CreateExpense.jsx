import { useState } from "react";
import axios from "axios";
import "../designs/CreateExpense.css";
function CreateExpense({ groupId, members, currentUserId, onClose }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [paidBy, setPaidBy] = useState(currentUserId);
  const [splitAmount, setSplitAmount] = useState({});

  const handleClick = async () => {
    let splitsEqual = "";
    let splitsExact = "";
    let splits = "";
    if (splitType == "equal") {
      splitsEqual = members.map((member) => ({
        user: member.userId,
        name: member.name,
      }));
      splits = splitsEqual;
    } else if (splitType == "exact") {
      splitsExact = members.map((member) => ({
        user: member.userId,
        amount: splitAmount[member.userId] || 0,
        name: member.name,
      }));
      splits = splitsExact;
    }

    const expenseData = {
      groupId,
      description,
      amount: parseFloat(amount),
      splitType,
      splits,
      paidBy,
    };

    console.log("Expense Data:", expenseData);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/expense",
        { data: expenseData },
        {
          withCredentials: true,
        },
      );
      // console.log("Expense created:", response.data);
      onClose();
    } catch (error) {
      console.error("Error creating expense:", error);
      alert(error.response?.data?.message || "Failed to create expense");
    }
  };

  return (
    <div className="createExpenseCard">
      <div className="creatCard">
        <h2>Add New Expense</h2>
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
        <div className="userList">
          {splitType === "exact" &&
            members.map((member) => (
              <div key={member.userId} value={member.userId}>
                {member.name}
                <input
                  type="number"
                  className="splitAmount"
                  value={splitAmount[member.userId] || ""}
                  onChange={(e) => {
                    setSplitAmount((other) => ({
                      ...other,
                      [member.userId]: Number(e.target.value),
                    }));
                  }}
                />
              </div>
            ))}
        </div>
        <div className="saveExpense">
          <button onClick={onClose}>Close</button>
          <button onClick={handleClick}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default CreateExpense;
