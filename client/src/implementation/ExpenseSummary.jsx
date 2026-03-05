import "../designs/groupSummary.css";
import axios from "axios";
function ExpenseSummary({ selectedExpense, handleCloseExpense }) {

  const handleDeleteExpense = async (expenseId) => {
    // console.log(expenseId);
    try {
      const response = await axios.delete(`http://localhost:5000/expenses/${expenseId}`, {
        withcredentials: true
      });
      const data = response.data;
      console.log(data);
      handleCloseExpense();
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div>
      {selectedExpense && (
        <div className="expense-overlay" onClick={handleCloseExpense}>
          <div className="expense-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseExpense}>
              x
            </button>
            <button className="delete-btn" onClick={() => handleDeleteExpense(selectedExpense._id)}>
              delete
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

export default ExpenseSummary;
