import { Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./implementation/DashboardLayout";
import Home from "./pages/HomePage";
import Group from "./pages/GroupPage";
import Friends from "./pages/FriendsPage";
import GroupSummary from "./implementation/GroupSummary";
function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Authentication />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/groups" element={<Group />} />
        <Route path="/groups/:groupId/summary" element={<GroupSummary />} />
        <Route path="/analytics" element={<div>Analytics Page</div>} />
        <Route path="/friends" element={<Friends />} />
      </Route>
    </Routes>
  );
}

export default App;
