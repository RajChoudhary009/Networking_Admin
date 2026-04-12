import { createContext, useState, useEffect } from 'react'
import axios from "axios";
import { SERVER_API_URL } from "../server/server";
export const UserContaxt = createContext(null)

export const UserWrapper = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('global_user_token');

            if (!token) {
                setLoading(false);
                return;
            }
            
            const res = await axios.post(`${SERVER_API_URL}/api/users/current`,{}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // console.log("userData", res.data.user)
            setUserData(res.data.user);

        } catch (error) {
            console.log("User fetch error", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();   // 👈 page load pe call hoga
    }, []);

    return (
        <UserContaxt.Provider value={{ userData, setUserData, loading, fetchUser }}>
            {children}
        </UserContaxt.Provider>
    )
}