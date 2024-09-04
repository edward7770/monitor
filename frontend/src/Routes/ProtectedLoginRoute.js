import { Navigate } from "react-router"
import { useAuth } from "../context/useAuth";

const ProtectedLoginRoute = ({ children }) => {
    const { isLoggedIn }  = useAuth();

    return !isLoggedIn() ? (
        <>{children}</>
    ) : (
        <>
            <Navigate to="/dashboard" replace />
        </>
    );
}

export default ProtectedLoginRoute;