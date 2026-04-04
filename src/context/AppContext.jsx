import { createContext, useEffect, useState, useCallback } from "react";
import { AppConstants } from "../util/constants";
import { toast } from "react-toastify";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = (props) => {

    //axios.defaults.withCredentials = true;

    const backendURL = AppConstants.BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    const getUserData = useCallback(async () => {
        try {
            const res = await axios.get(`${backendURL}/profile`);
            if (res.status === 200) {
                setUserData(res.data);
            }
            else {
                toast.error("Unable to fetch user data");
            }
        } catch (error) {
            toast.error("Error fetching user data. Please try again.", error.message);
        }
    }, [backendURL]);

    const getAuthState = useCallback(async () => {
        try {
            const res = await axios.get(backendURL + "/is-authenticated");
            if (res.status === 200 && res.data === true) {
                setIsLoggedIn(true);
                await getUserData();
            }
            else {
                setIsLoggedIn(false);
                //setUserData(false);
            }
        }
        catch (error) {
            if (error.response) {
                const msg = error.response.data?.message || "Error checking authentication state. Please try again.";
                toast.error(msg);
            }
            else {
                toast.error("Error 1", error.message);
            }
            setIsLoggedIn(false);
            setUserData(false);
        }
    }, [backendURL, getUserData]);

    useEffect(() => {
        // eslint-disable-next-line
        getAuthState();
    }, []);

    const contextValue = {
        backendURL,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData, getAuthState
    }

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )
}