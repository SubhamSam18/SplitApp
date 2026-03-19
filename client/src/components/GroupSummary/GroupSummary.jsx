import { useEffect, useState } from "react";
import API from "../../services/api";
import { useParams } from "react-router-dom";
import './GroupSummary.css';
import CreateExpense from "../CreateExpense/CreateExpense";
import ExpenseSummary from "../ExpenseSummary/ExpenseSummary";
import { useNavigate } from "react-router-dom";

function GroupSummary() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [groupName, setGroupName] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [members, setMembers] = useState([]);
  const [showExpense, setShowExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showCreateExpense, setShowCreateExpense] = useState(false);

  const findGroupData = async () => {
    try {
      const response = await API.get(
        `/groups/${groupId}/summary`
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
  const handleEditExpense = (expense) => {
    setShowExpense(false);
    setSelectedExpense(expense);
    setShowCreateExpense(true);
  };
  useEffect(() => {
    findGroupData();
  }, []);

  useEffect(() => {
    const summary = document.querySelector(".summaryDiv");

    if (showExpense) {
      summary.classList.add("modal-open");
    } else {
      summary.classList.remove("modal-open");
    }
    return () => summary?.classList.remove("modal-open");
  }, [showExpense]);

  return (
    <div className="groupSummaryContainer">
      <div className="summaryDiv">
        <div className="card-glass-glow"></div>
        <div className="groupTitle">
          <button className="backButton" onClick={() => navigate(-1)}>
            ←
          </button>
          <h1>{groupName}</h1>
        </div>
        <div className="addButton">
          <button
            className="addExpense"
            onClick={() => {
              setSelectedExpense(null);
              setShowCreateExpense(true);
            }}
          >
            + Add Expense
          </button></div>
        {showCreateExpense && (
          <CreateExpense
            groupId={groupId}
            members={members}
            currentUserId={currentUserId}
            onClose={() => {
              setShowCreateExpense(false);
              setSelectedExpense(null);
            }}
            onSave={() => {
              setShowCreateExpense(false);
              setSelectedExpense(null);
              findGroupData();
            }}
            selectedExpense={selectedExpense}
          />
        )}

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
                  <div className="card-glass-glow"></div>
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
                    <div className="share-row">
                      <strong>Your Share: </strong>
                      <span className={`share-amount ${expense.paidBy === currentUserId && userShareAmount > 0 ? "share-pos" :
                        expense.paidBy !== currentUserId && userShareAmount > 0 ? "share-neg" : ""
                        }`}>
                        <span className={`status-dot ${expense.paidBy === currentUserId && userShareAmount > 0 ? "dot-pos" :
                          expense.paidBy !== currentUserId && userShareAmount > 0 ? "dot-neg" : ""
                          }`}></span>
                        ₹{expense.paidBy === currentUserId ? userShareAmount : -userShareAmount}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="noExpense">
              <p>Please Add expenses to see them here.</p>
            </div>
          )}
        </div>

        {showExpense && selectedExpense && (
          <ExpenseSummary
            selectedExpense={selectedExpense}
            handleCloseExpense={handleCloseExpense}
            handleEditExpense={handleEditExpense}
            refreshData={findGroupData}
          />
        )}
      </div>
    </div>
  );
}

export default GroupSummary;
