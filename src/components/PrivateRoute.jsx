
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  // const dispatch = useDispatch();
  const { token, isAuthenticated, hasCheckedAuth } = useSelector((state) => state.auth);

  // If we have a token but haven't checked it yet, show loading (or nothing)
  if (token && !hasCheckedAuth) {
    return null; // Or <LoadingPage />
  }

  // If no token or not authenticated after check, redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}