import './ExpenseSummary.css';
import API from "../../services/api";

function ExpenseSummary({ selectedExpense, handleCloseExpense, handleEditExpense }) {
  const handleDeleteExpense = async (expenseId) => {
    console.log(expenseId);
    try {
      const response = await API.delete(`/expense/${expenseId}`);
      const data = response.data;
      // console.log(data);
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
            <button className="edit-btn" onClick={() => { handleEditExpense(selectedExpense); }}>
              Edit Expense
            </button>
            <button className="delete-btn" onClick={() => handleDeleteExpense(selectedExpense._id)}>
              Delete Expense
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpenseSummary;
