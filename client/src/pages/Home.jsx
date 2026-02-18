import HomeDesign from "../designs/HomeDesign";
import axios from "axios";
import { useState, useEffect } from "react";

function Home() {
  const youOwed = 1200;
  const youAreOwed = 1500;
  const [groups, setGroups] = useState([]);
  const findGroups = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/groups/", {
        withCredentials: true,
      });
      setGroups(response.data);
      console.log(groups.members);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    findGroups();
  }, []);
  return (
    <HomeDesign youOwe={youOwed} youAreOwed={youAreOwed} groups={groups} />
  );
}

export default Home;
