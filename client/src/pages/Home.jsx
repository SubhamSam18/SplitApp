import HomeDesign from "../designs/HomeDesign";

function Home() {
  const youOwed = 1200;
  const youAreOwed = 1500;

  return <HomeDesign youOwe={youOwed} youAreOwed={youAreOwed} />;
}

export default Home;