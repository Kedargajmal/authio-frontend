// import { createContext, useEffect, useState, useCallback } from "react";
// import { AppConstants } from "../util/constants";
// import { toast } from "react-toastify";
// import axios from "axios";

// // eslint-disable-next-line react-refresh/only-export-components
// export const AppContext = createContext();

// export const AppContextProvider = (props) => {


//     const backendURL = AppConstants.BACKEND_URL;
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [userData, setUserData] = useState(false);
//     const [token, setToken] = useState(localStorage.getItem("jwt") || "");

//     useEffect(() => {
//         if (token) {
//             axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//         } else {
//             delete axios.defaults.headers.common["Authorization"];
//         }
//     }, [token]);

//     const getUserData = useCallback(async () => {
//         try {
//             const res = await axios.get(`${backendURL}/profile`);
//             if (res.status === 200) {
//                 setUserData(res.data);
//             }
//             else {
//                 toast.error("Unable to fetch user data");
//             }
//         } catch (error) {
//             if (error.response && error.response.status === 401) {
//                 setIsLoggedIn(false);
//                 setUserData(false);
//             } else {
//                 toast.error("Error fetching user data. Please try again.");
//             }
//         }
//     }, [backendURL]);

//     const getAuthState = useCallback(async () => {
//         try {
//             const res = await axios.get(backendURL + "/is-authenticated");
//             if (res.status === 200 && res.data === true) {
//                 setIsLoggedIn(true);
//                 await getUserData();
//             }
//             else {
//                 setIsLoggedIn(false);
//                 setUserData(false);
//             }
//         }
//         catch (error) {
//             if (error.response && error.response.status === 401) {
//                 setIsLoggedIn(false);
//                 setUserData(false);
//                 return;
//             }
//             if (error.response) {
//                 const msg = error.response.data?.message || "Error checking authentication state. Please try again.";
//                 toast.error(msg);
//             }
//             else {
//                 toast.error("Error 1", error.message);
//             }
//             setIsLoggedIn(false);
//             setUserData(false);
//         }
//     }, [backendURL, getUserData]);

//     useEffect(() => {
//         // eslint-disable-next-line
//         getAuthState();
//     }, [getAuthState]);

//     const contextValue = {
//         backendURL,
//         isLoggedIn, setIsLoggedIn,
//         userData, setUserData,
//         getUserData, getAuthState
//     }

//     return (
//         <AppContext.Provider value={contextValue}>
//             {props.children}
//         </AppContext.Provider>
//     )
// }

import { createContext, useEffect, useState, useCallback } from "react";
import { AppConstants } from "../util/constants";
import { toast } from "react-toastify";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendURL = AppConstants.BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("jwt") || "");

    // Set Authorization header whenever token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [token]);

    const getUserData = useCallback(async () => {
        try {
            const res = await axios.get(`${backendURL}/profile`);
            if (res.status === 200) {
                setUserData(res.data);
            } else {
                toast.error("Unable to fetch user data");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setIsLoggedIn(false);
                setUserData(false);
            } else {
                toast.error("Error fetching user data. Please try again.");
            }
        }
    }, [backendURL]);

    const getAuthState = useCallback(async () => {
        try {
            const res = await axios.get(backendURL + "/is-authenticated");
            if (res.status === 200 && res.data === true) {
                setIsLoggedIn(true);
                await getUserData();
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setIsLoggedIn(false);
                setUserData(false);
                return;
            }
            if (error.response) {
                const msg = error.response.data?.message || "Error checking authentication state. Please try again.";
                toast.error(msg);
            } else {
                toast.error("Network error: " + error.message);
            }
            setIsLoggedIn(false);
            setUserData(false);
        }
    }, [backendURL, getUserData]);

    useEffect(() => {
        // eslint-disable-next-line
        getAuthState();
    }, [getAuthState]);

    const logout = () => {
        localStorage.removeItem("jwt");
        setToken("");
        setIsLoggedIn(false);
        setUserData(false);
    };

    const contextValue = {
        backendURL,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData, getAuthState,
        token, setToken,
        logout
    };

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
};