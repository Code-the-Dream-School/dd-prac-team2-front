/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import { createContext, useState } from "react";

const AuthContext = createContext({});


export const AuthProvider = ({children})=>{
    const [auth, setAuth] = useState({
        userId: "",
        userName: "",
        userEmail: "",
        role: [],
        loggedIn: false,
        avatarUrl: "",
        isActive: undefined,
        accessToken: ""
    });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
