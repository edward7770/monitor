import { Navigate, useLocation } from "react-router"
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";

const ProtectedRoleRoute = ({ children }) => {
    const location = useLocation();
    const { isLoggedIn, getUserRole }  = useAuth();
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
    }, [getUserRole]);

    if (isLoading) {
        return <div></div>;
    }

    return isLoggedIn() && userRole !== "Client" ? (
        <>{children}</>
    ) : (
        <>
            <Navigate to={isLoggedIn() ? "/dashboard" : "/login"} state={{ from: location }} replace />
        </>
    );
}

export default ProtectedRoleRoute;