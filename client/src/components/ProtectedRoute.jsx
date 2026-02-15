import { Navigate } from "react-router-dom";

function ProtectedRoute({childern}){
    const token = localStorage.getItem("token");

    if(!token){
        return <Navigate to="/login"/>
    }

    return children;
}

export default ProtectedRoute;