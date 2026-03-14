import { Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication/Authentication";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/HomePage/HomePage";
import Group from "./pages/GroupPage/GroupPage";
import Friends from "./pages/FriendsPage/FriendsPage";
import GroupSummary from "./components/GroupSummary/GroupSummary";
import Analytics from "./pages/AnalyticsPage/AnalyticsPage";
import { LoadingProvider } from "./context/LoadingContext";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import Navbar from "./components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <LoadingProvider>
      <LoadingScreen />
      <Routes>
        <Route path="/auth" element={<Authentication />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="main-layout">
                <Navbar />
                <div className="dashboard-content">
                  <Outlet />
                </div>
              </div>
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/groups" element={<Group />} />
          <Route path="/groups/:groupId/summary" element={<GroupSummary />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/friends" element={<Friends />} />
        </Route>
      </Routes>
    </LoadingProvider>
  );
}

export default App;
