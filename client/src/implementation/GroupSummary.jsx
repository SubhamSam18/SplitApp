import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../designs/groupSummary.css";
import CreateExpense from "./CreateExpense";
import ExpenseSummary from "./ExpenseSummary";

function GroupSummary() {
  const { groupId } = useParams();
  const [groupName, setGroupName] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [members, setMembers] = useState([]);
  const [showExpense, setShowExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showExpenseCard, setShowExpenseCard] = useState();

  const findGroupData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/groups/${groupId}/summary`,
        { withCredentials: true },
      );
      setGroupName(response.data.group.name);
      setExpenses(response.data.expenses);
      setCurrentUserId(response.data.currentUserId);
      setMembers(response.data.memberSummary);
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
      <button
        className="addExpense"
        onClick={() => setShowExpenseCard(!showExpenseCard)}
      >
        + Add Expense
      </button>
      {showExpenseCard && (
        <CreateExpense
          groupId={groupId}
          members={members}
          currentUserId={currentUserId}
          onClose={() => setShowExpenseCard(!showExpenseCard)}
        />
      )}

      {/* Scrollable Expenses List */}
      <div className="expensesList">
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
      </div>

      {selectedExpense && (
        <ExpenseSummary
          selectedExpense={selectedExpense}
          handleCloseExpense={handleCloseExpense}
        />
      )}
    </div>
  );
}

export default GroupSummary;
