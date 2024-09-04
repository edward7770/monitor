import { Navigate, useLocation } from "react-router"
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";

const ProtectedSuperadminRoute = ({ children }) => {
    const location = useLocation();
    const { isLoggedIn, getUserRole, getUserManagement }  = useAuth();
    const [userRole, setUserRole] = useState(null);
    const [userManagement, setUserManagement] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const role = await getUserRole();
                const userManagementstatus = await getUserManagement();
                setUserRole(role);
                setUserManagement(userManagementstatus);
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

    return isLoggedIn() && userManagement === true && (userRole === "Admin" || userRole === "Superadmin") ? (
        <>{children}</>
    ) : (
        <>
            <Navigate to={isLoggedIn() ? "/dashboard" : "/login"} state={{ from: location }} replace />
        </>
    );
}

export default ProtectedSuperadminRoute;