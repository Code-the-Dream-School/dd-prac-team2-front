import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({allowedRole}) => {
    const {auth} = useAuth();
    const location = useLocation();

    return(
        auth?.role === allowedRole 
        ? <Outlet/> 
        : auth?.userName 
            ? <Navigate to="/unauthorized" state={{from: location}} replace></Navigate>
            : <Navigate to="/login" state={{from:location}} replace></Navigate>
    )
};

export default RequireAuth;