import { createContext, useState } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [message, setMessage] = useState("");

    const showNotification = (msg) => {
        setMessage(msg + " ✅");
        setTimeout(() => setMessage(""), 3000);
    };

    return (
        <NotificationContext.Provider value={{ message, showNotification }}>
            {children}
            {message && (
                <div style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    backgroundColor: "#6366f1",
                    color: "white",
                    padding: "1rem 2rem",
                    borderRadius: "5px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    zIndex: 9999,
                    backdropFilter: "blur(10px)",
                    fontWeight: "500",
                    animation: "slideIn 0.3s ease-out forwards"
                }}>
                    {message}
                </div>
            )}
        </NotificationContext.Provider>
    );
};
