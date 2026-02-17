function HomeDesign({ youOwe, youAreOwed }) {
  return (
    <div className="home-container">
      <div className="summary-card">
        <h3>You Owe</h3>
        <p>{youOwe}</p>
        <h4>You are owed</h4>
        <p>{youAreOwed}</p>
      </div>
    </div>
  );
}

export default HomeDesign;
