import { Navigate, useLocation } from "react-router"
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";

const ProtectedSuperadminRoute = ({ children }) => {
    const location = useLocation();
    const { isLoggedIn, getUserRole, getUserManagement }  = useAuth();
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const role = await getUserRole();
                setUserRole(role);
            } catch (error) {
                // Handle error
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserRole();
    }, [getUserManagement, getUserRole]);

    if (isLoading) {
        return <div></div>;
    }

    return isLoggedIn() && userRole === "Superadmin" ? (
        <>{children}</>
    ) : (
        <>
            <Navigate to={isLoggedIn() ? "/dashboard" : "/login"} state={{ from: location }} replace />
        </>
    );
}

export default ProtectedSuperadminRoute;