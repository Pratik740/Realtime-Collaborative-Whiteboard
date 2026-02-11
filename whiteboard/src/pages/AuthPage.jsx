import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Force logout on visiting auth page
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        // We really should disconnect the socket here too, but we can't import socket instance directly.
        // The next connectWithSocketServer call will create a new instance/connection.
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? "http://localhost:8000/api/signin" : "http://localhost:8000/api/signup";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(isLogin ? { email, password } : { username, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("username", data.username); // Store basic info
                    navigate("/dashboard");
                } else {
                    // Auto login after signup? Or switch to login
                    setIsLogin(true);
                    alert("Signup successful! Please login.");
                }
            } else {
                alert(data.msg || data.error || "Authentication failed");
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to server");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.button}>
                        {isLogin ? "Login" : "Sign Up"}
                    </button>
                </form>
                <p style={styles.toggleText}>
                    {isLogin ? "New here?" : "Already have an account?"}{" "}
                    <span onClick={() => setIsLogin(!isLogin)} style={styles.link}>
                        {isLogin ? "Create account" : "Login"}
                    </span>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
    },
    card: {
        width: "350px",
        padding: "2rem",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        marginTop: "1.5rem",
    },
    input: {
        marginBottom: "1rem",
        padding: "0.75rem",
        fontSize: "1rem",
        border: "1px solid #ddd",
        borderRadius: "4px",
    },
    button: {
        padding: "0.75rem",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        fontSize: "1rem",
        cursor: "pointer",
    },
    toggleText: {
        marginTop: "1rem",
        fontSize: "0.9rem",
    },
    link: {
        color: "#007bff",
        cursor: "pointer",
        fontWeight: "bold",
    },
};

export default AuthPage;
