import { Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./implementation/DashboardLayout";
import Home from "./pages/Home";
import Group from "./pages/Group";
import Friends from "./pages/Friends";
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
        <Route path="/analytics" element={<div>Analytics Page</div>} />
        <Route path="/friends" element={<Friends />} />
      </Route>
    </Routes>
  );
}

export default App;
