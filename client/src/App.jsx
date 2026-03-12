import { Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication/Authentication";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import Home from "./pages/HomePage/HomePage";
import Group from "./pages/GroupPage/GroupPage";
import Friends from "./pages/FriendsPage/FriendsPage";
import GroupSummary from "./components/GroupSummary/GroupSummary";
import Analytics from "./pages/AnalyticsPage/AnalyticsPage";
import { LoadingProvider } from "./context/LoadingContext";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";

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
              <DashboardLayout />
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
