import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../designs/groupSummary.css";

function GroupSummary() {
  const { groupId } = useParams();
  const [groupName, setGroupName] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");

  const findGroupData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/groups/${groupId}/summary`,
        { withCredentials: true },
      );
      setGroupName(response.data.group.name);
      setExpenses(response.data.expenses);
      setCurrentUserId(response.data.currentUserId);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    findGroupData();
  }, [groupId]);

  return (
    <div className="summaryDiv">
      <h1>{groupName}</h1>
      {expenses.length > 0 ? (
        expenses.map((expense) => {
          const userShare = expense.splits.find(
            (split) => split.user === currentUserId,
          );
          return (
            <div key={expense._id} className="groupSummary">
              <div className="description">
                <strong>Description: </strong>
                {expense.description || "No description"}
              </div>
              <div className="paidBy">
                <strong>Paid By: </strong>
                {expense.payerName}
              </div>
              <div className="amount">
                <strong>Amount: </strong>₹{expense.amount}
              </div>
              <div className="share">
                {userShare ? (
                  <div>
                    <strong>Your Share: </strong>₹{userShare.amount}
                  </div>
                ) : (
                  <div>
                    <strong>Your Share: </strong>₹0 (Not part of this expense)
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p>No expenses found.</p>
      )}
    </div>
  );
}

export default GroupSummary;
