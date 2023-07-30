/*
    ==========================
    =  THIRD PARTY LIBRARY   =
    ==========================
*/
import axios from "../api/axios";
/*
    ==========================
    =      CUSTOM HOOKS      =
    ==========================
*/
import useAuth from "./useAuth";

const useRefreshToken = () => {
    /*
        ==========================
        =      CUSTOM HOOKS      =
        ==========================
    */    
    const {setAuth} = useAuth();
    /*
        ==========================
        =     ASYNC FUNCTONS     =
        ==========================
    */ 
    const refresh = async () => {
        const response = await axios.get(`${process.env.REACT_APP_AUTH}/${process.env.REACT_APP_AUTH_REFRESHTOKEN}`,
        {
        withCredentials: true
        });
        setAuth((prevAuth) => {
            console.log("prevAuth", prevAuth);
            //console.log(response.data.accessToken);
            console.log("refresh", response);
            return {
                userId: response.data.user.userId,
                userName: response.data.user.name,
                userEmail: "secch97@gmail.com",
                role: "admin",
                loggedIn: true,
                accessToken: response.data.token
            };
        });
        //return response.data.accessToken;
        return response;
    }
    return refresh;
}

export default useRefreshToken