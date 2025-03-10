import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children }) => {
  const token =localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="http://localhost:3000/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
