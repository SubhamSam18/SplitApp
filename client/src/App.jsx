import { Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/auth" element={<Authentication />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <h1>Dashboard</h1>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
