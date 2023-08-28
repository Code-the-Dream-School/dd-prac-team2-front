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
  const { setAuth } = useAuth();
  /*
        ==========================
        =     ASYNC FUNCTONS     =
        ==========================
    */
  const refresh = async () => {
    const response = await axios.get(`auth/refreshToken`, {
      withCredentials: true,
    });
    setAuth((prevAuth) => {
      console.log("prevAuth", prevAuth);
      //console.log(response.data.accessToken);
      console.log("refresh", response);
      return {
        userId: response.data.user.userId,
        userName: response.data.user.name,
        userEmail: response.data.user.email,
        role: response.data.user.role,
        loggedIn: true,
        accessToken: response.data.token,
      };
    });
    return response.data.token;
  };
  return refresh;
};

export default useRefreshToken;
