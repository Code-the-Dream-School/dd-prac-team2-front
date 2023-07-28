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
        /*const response = await axios.get(`${process.env.REACT_APP_AUTH}/${process.env.REACT_APP_AUTH_REFRESHTOKEN}`,
        {
        withCredentials: true
        });*/
        const response = {
            userName: "Saul Ernesto Castillo Chamagua",
            userEmail: "secch97@gmail.com",
            role: "admin",
            token: "newToken"
        };
        setAuth((prevAuth) => {
            console.log(prevAuth);
            //console.log(response.data.accessToken);
            console.log(response);
            return {
                userName: response.userName,
                userEmail: response.userEmail,
                role: response.role,
                loggedIn: true,
                //accessToken: response.data.accessToken
                accessToken: response.token
            };
        });
        //return response.data.accessToken;
        return response;
    }
    return refresh;
}

export default useRefreshToken