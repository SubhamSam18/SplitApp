import "./homeDesign.css";
function HomeDesign({ youOwe, youAreOwed, groups }) {
  return (
    <div className="homeContainer">
      <div className="mainCard">
        <div className="summary">
          <div className="totalSection">
            <p>Total Balance</p>
            <h2>₹{youOwe - youAreOwed}</h2>
          </div>

          <div className="splitSection">
            <div className="moneyBox receive">
              <p>You’ll Receive</p>
              <h3>₹{youOwe}</h3>
            </div>

            <div className="moneyBox pay">
              <p>You’ll Pay</p>
              <h3>₹{youAreOwed}</h3>
            </div>
          </div>
        </div>

        <div className="groups">
          <p>Your Groups</p>
          <div className="groupsGrid">
            {groups.length === 0 ? (
              <p>No groups found</p>
            ) : (
              groups.map((group) => (
                <div className="groupBox" key={group._id}>
                  <div className="groupLogo">✈️</div>
                  <div className="groupName">{group.name}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeDesign;
