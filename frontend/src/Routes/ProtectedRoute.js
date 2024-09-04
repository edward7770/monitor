import { Navigate, useLocation } from "react-router"
import { useAuth } from "../context/useAuth";

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const { isLoggedIn }  = useAuth();

    return isLoggedIn() ? (
        <>{children}</>
    ) : (
        <>
            <Navigate to="/login" state={{ from: location }} replace />
        </>
    );
}

export default ProtectedRoute;