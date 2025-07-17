import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [isAdmin, setIsAdmin] = useState(0);

    useEffect(() => {
        // Call backend to check if user is logged in
        fetch('http://localhost:3000/api/user/me', { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (data.loggedIn) {
                    setUser(data.user);
                    setIsAdmin(data.user.isAdmin)
                } else {
                    setUser(false); // explicitly "not logged in"
                    setIsAdmin(0);
                }
            })
            .catch(() => setUser(false)); // handle error
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isAdmin, setIsAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);