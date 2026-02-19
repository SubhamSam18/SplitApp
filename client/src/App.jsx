import { Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./designs/DashboardLayout";
import Home from "./pages/Home";
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
        <Route path="/groups" element={<div>Groups</div>} />
        <Route path="/analytics" element={<div>Analytics Page</div>} />
        <Route path="/friends" element={<div>Friends Page</div>} />
      </Route>
    </Routes>
  );
}

export default App;
