import HomeDesign from "../implementation/HomeDesign";
import axios from "axios";
import { useState, useEffect } from "react";

function Home() {
  const [youOwe, setYouOwe] = useState(0);
  const [youAreOwed, setYouAreOwed] = useState(0);
  const [groups, setGroups] = useState([]);

  const findGroups = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/groups/", {
        withCredentials: true,
      });
      const summaryRes = await axios.get("http://localhost:5000/api/summary", {
        withCredentials: true,
      });
      setGroups(response.data);
      setYouOwe(summaryRes.data.youOwe);
      setYouAreOwed(summaryRes.data.youAreOwed);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    findGroups();
  }, []);
  return <HomeDesign youOwe={youOwe} youAreOwed={youAreOwed} groups={groups} />;
}

export default Home;
