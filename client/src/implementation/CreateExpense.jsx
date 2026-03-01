import "../designs/CreateExpense.css";
function CreateExpense({ onClose }) {
  return (
    <div className="createExpenseCard">
      <div className="creatCard">
        <div className="expenseDescription">
          <input type="text" placeholder="Add Description" />
        </div>
        <div className="expenseAmount">
          <input type="number" placeholder="Enter Amount" />
        </div>
        <div className="saveExpense">
          <button onClick={onClose}>Close</button>
          <button onClick={onClose}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default CreateExpense;
