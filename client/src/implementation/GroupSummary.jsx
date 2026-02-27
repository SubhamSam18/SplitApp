import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../designs/groupSummary.css";

function GroupSummary() {
  const { groupId } = useParams();
  const [groupName, setGroupName] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [showExpense, setShowExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

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

  const handleClick = (expense) => {
    try {
      setSelectedExpense(expense);
      setShowExpense(true);
    } catch (err) {
      console.log(err);
    }
  };
  const handleCloseExpense = () => {
    setShowExpense(false);
    setSelectedExpense(null);
  };
  useEffect(() => {
    findGroupData();
  }, [groupId]);

  useEffect(() => {
    const summary = document.querySelector(".summaryDiv");

    if (showExpense) {
      summary.classList.add("modal-open");
    } else {
      summary.classList.remove("modal-open");
    }

    return () => summary.classList.remove("modal-open");
  }, [showExpense]);

  return (
    <div className="summaryDiv">
      <h1>{groupName}</h1>
      {expenses.length > 0 ? (
        [...expenses].reverse().map((expense) => {
          const userShare = expense.splits.find(
            (split) => split.user === currentUserId,
          );
          const userShareAmount = userShare ? userShare.amount : 0;
          return (
            <div
              key={expense._id}
              className="groupSummary"
              onClick={() => handleClick(expense)}
            >
              <div className="description">
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
                {expense.paidBy === currentUserId && userShareAmount > 0 ? (
                  <div>
                    <strong>Your Share: </strong>₹{userShareAmount}
                  </div>
                ) : expense.paidBy !== currentUserId && userShareAmount > 0 ? (
                  <div>
                    <strong>Your Share: </strong>₹-{userShareAmount}
                  </div>
                ) : (
                  <div>
                    <strong>Your Share: </strong>₹0
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p>No expenses found.</p>
      )}

      {showExpense && selectedExpense && (
        <div className="expense-overlay" onClick={handleCloseExpense}>
          <div className="expense-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseExpense}>
              ×
            </button>

            <h2>Expense Details</h2>

            <div className="expense-detail">
              <strong>Description: </strong>
              {selectedExpense.description || "No description"}
            </div>

            <div className="expense-detail">
              <strong>Amount: </strong>₹{selectedExpense.amount}
            </div>

            <div className="expense-detail">
              <strong>Paid By: </strong>
              {selectedExpense.payerName}
            </div>

            <div className="expense-detail">
              <strong>Date: </strong>
              {new Date(selectedExpense.createdAt).toLocaleDateString()}
            </div>

            <h3>Split Details</h3>

            <div className="splits-list">
              {selectedExpense.splits.map((split, index) => (
                <div key={index} className="split-item">
                  <span>{split.name || split.user}</span>
                  <span>₹{split.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupSummary;
