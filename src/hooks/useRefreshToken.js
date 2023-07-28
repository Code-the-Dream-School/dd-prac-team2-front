import React from 'react';
import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const {setAuth} = useAuth();

    const refresh = async () => {
        const response = await axios.get(`${process.env.REACT_APP_AUTH}/${process.env.REACT_APP_AUTH_REFRESHTOKEN}`,
        {
        withCredentials: true
        });
        setAuth((prevAuth) => {
            console.log(prevAuth);
            console.log(response.data.accessToken);
            return {
                ...prevAuth,
                accessToken: response.data.accessToken
            };
        });
        return response.data.accessToken;
    }
    return refresh;
}

export default useRefreshToken