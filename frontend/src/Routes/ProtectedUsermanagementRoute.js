import { Navigate, useLocation } from "react-router"
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";

const ProtectedUsermanagementRoute = ({ children }) => {
    const location = useLocation();
    const { isLoggedIn, getUserManagement }  = useAuth();
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const role = await getUserManagement();
                setUserRole(role);
            } catch (error) {
                // Handle error
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserRole();
    }, [getUserManagement]);

    if (isLoading) {
        return <div></div>;
    }

    return isLoggedIn() && userRole === true ? (
        <>{children}</>
    ) : (
        <>
            <Navigate to={isLoggedIn() ? "/dashboard" : "/login"} state={{ from: location }} replace />
        </>
    );
}

export default ProtectedUsermanagementRoute;