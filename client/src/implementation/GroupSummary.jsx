import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function GroupSummary() {
  const { groupId } = useParams();
  const findGroupData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/groups/${groupId}/summary`,
        { withCredentials: true },
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    findGroupData();
  }, [groupId]);
  return (
    <div>
      <h2>Group Summary for {groupId}</h2>
    </div>
  );
}

export default GroupSummary;
