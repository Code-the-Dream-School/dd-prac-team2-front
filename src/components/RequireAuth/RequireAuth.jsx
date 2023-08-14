/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import PropTypes from "prop-types";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import { useLocation, Navigate, Outlet } from "react-router-dom";
/*
    ==========================
    =      CUSTOM HOOKS      =
    ==========================
*/
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({allowedRole}) => {
    console.log("ALLOWED ROLE", allowedRole);
    const {auth} = useAuth();
    const location = useLocation();
    console.log("AUTH ROLE", auth.role);
    console.log(auth?.role, allowedRole, auth?.role.includes(allowedRole));
    return(
        auth?.role.some((role)=>allowedRole.includes(role))
        ? <Outlet/> 
        : auth?.userName 
            ? <Navigate to="/unauthorized" state={{from: location}} replace></Navigate>
            : <Navigate to="/login" state={{from:location}} replace></Navigate>
    )
};

export default RequireAuth;

RequireAuth.propTypes = {
    allowedRole: PropTypes.string.isRequired
};