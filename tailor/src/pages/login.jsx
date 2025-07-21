import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showSplash, setShowSplash] = useState(true);
    const [message, setMessage] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [saveCredentials, setSaveCredentials] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check session
        fetch("http://localhost:8000/api/check-session", {
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.isLoggedIn) {
                    setIsLoggedIn(true);
                    navigate("/dashboard");
                }
            })
            .catch((error) => {
                console.error("Error checking session:", error);
                setMessage("Error checking session. Please try again.");
            });

        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigate]);

    const validateEmail = (email) => {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!gmailRegex.test(email)) {
            return "Email must be a valid Gmail address (e.g., user@gmail.com).";
        }
        return "";
    };

    const validatePassword = (pwd) => {
        if (pwd.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        if (!/[A-Z]/.test(pwd)) {
            return "Password must contain at least one capital letter.";
        }
        if (!/[0-9]/.test(pwd)) {
            return "Password must contain at least one number.";
        }
        if (!/[!@#$%^&*]/.test(pwd)) {
            return "Password must contain at least one special character (!@#$%^&*).";
        }
        return "";
    };

    const handleFieldClick = async () => {
        if (username) {
            try {
                const response = await fetch("http://localhost:8000/api/get-saved-credentials", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ username }),
                });
                const data = await response.json();
                if (data.hasSavedCredentials) {
                    setUsername(data.savedUsername);
                    setPassword(data.savedPlainPassword || "");
                    setSaveCredentials(true);
                }
            } catch (error) {
                console.error("Error fetching saved credentials:", error);
                setMessage("Error fetching saved credentials. Please try again.");
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");
        setEmailError("");
        setPasswordError("");

        const emailValidationError = validateEmail(username);
        if (emailValidationError) {
            setEmailError(emailValidationError);
            return;
        }

        const passwordValidationError = validatePassword(password);
        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password, saveCredentials }),
            });
            const data = await response.json();
            if (!response.ok) {
                setMessage(data.message || "Login failed. Please try again.");
                if (data.error) {
                    console.error("Server error details:", data.error, data.stack);
                }
                return;
            }
            setMessage(data.message);
            setIsLoggedIn(true);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error connecting to server:", error);
            setMessage("Error connecting to server: " + error.message);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/logout", {
                method: "POST",
                credentials: "include",
            });
            const data = await response.json();
            setMessage(data.message);
            setIsLoggedIn(false);
            setUsername("");
            setPassword("");
            setSaveCredentials(false);
        } catch (error) {
            console.error("Error logging out:", error);
            setMessage("Error logging out: " + error.message);
        }
    };

    if (showSplash) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
                <div className="text-center">
                    <img 
                        src="/assets/img28.PNG" 
                        alt="Splash Image" 
                        className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 mx-auto mb-4 sm:mb-6 rounded-lg" 
                    />
                    <h1 
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-btnBg"
                    >
                        Welcome to Darzee Khana
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen md:font-font">
            {/* Left Section */}
            <div className="w-full md:w-1/2 bg-gray-50 flex flex-col justify-between py-6 px-4 sm:px-6 md:px-8">
                <div className="flex flex-col items-center mt-6 md:mt-10">
                    <div className="relative">
                        <img 
                            src="/assets/img28.PNG" 
                            alt="Person with Phone" 
                            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-72 lg:h-72 rounded-lg" 
                        />
                    </div>
                    <p className="text-gray-600 text-center mt-6 sm:mt-8 text-sm sm:text-base md:text-md max-w-xs sm:max-w-sm">
                        Single Platform to Access & Manage all VT Products & Services.
                        Manage your organizations, Apps, Subscription, Billing & More with ease.
                    </p>
                </div>
                <div className="text-gray-500 text-xs sm:text-sm text-center mb-4">
                    <p>WE ALWAYS LOVE TO SUPPORT YOU!</p>
                    <p className="mt-1">📧 PhiHorizon.COM</p>
                    <p>📞 pak +92-304-111 8333</p>
                    <p className="mt-1">Privacy Policy</p>
                </div>
            </div>

            {/* Right Section */}
            <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-center py-6 px-4 sm:px-6 md:px-8 relative">
                <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-200 flex items-center justify-center rounded">
                        <img src="/assets/img28.PNG" alt="" className="w-full h-full rounded" />
                    </div>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center md:text-left">
                    {isLoggedIn ? "Welcome Back!" : "Log in using Email & Password"}
                </h2>
                {message && (
                    <p className={`mb-4 text-sm sm:text-base ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
                        {message}
                    </p>
                )}
                {!isLoggedIn ? (
                    <>
                        <div className="flex mb-4 sm:mb-6 w-full max-w-md">
                            <label className="text-btnBg border-b border-gray-300 text-sm sm:text-base">LOGIN</label>
                        </div>
                        <input
                            type="text"
                            placeholder="Email (e.g., user@gmail.com)"
                            className="w-full max-w-md p-2 mb-4 border border-gray-300 rounded-xl bg-gray-50 text-sm sm:text-base"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setEmailError("");
                            }}
                            onClick={handleFieldClick}
                        />
                        {emailError && <p className="text-red-500 mb-4 text-sm sm:text-base">{emailError}</p>}
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full max-w-md p-2 mb-4 border border-gray-300 rounded-xl bg-gray-50 text-sm sm:text-base"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordError("");
                            }}
                            onClick={handleFieldClick}
                        />
                        {passwordError && <p className="text-red-500 mb-4 text-sm sm:text-base">{passwordError}</p>}
                        <div className="flex items-center justify-between w-full max-w-md mb-4">
                            <label className="flex items-center text-sm sm:text-base">
                                <input
                                    type="checkbox"
                                    checked={saveCredentials}
                                    onChange={(e) => setSaveCredentials(e.target.checked)}
                                    className="mr-2"
                                />
                                Save Credentials
                            </label>
                        </div>
                        <div className="flex items-center justify-center sm:justify-between w-full max-w-md">
                            <button
                                onClick={handleLogin}
                                className="bg-btnBg text-white py-2 px-4 sm:px-6 rounded text-sm sm:text-base hover:bg-btnHover w-full sm:w-auto"
                            >
                                LOGIN
                            </button>
                        </div>
                    </>
                ) : (
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white py-2 px-4 sm:px-6 rounded text-sm sm:text-base hover:bg-red-600 w-full max-w-md sm:w-auto"
                    >
                        LOGOUT
                    </button>
                )}
            </div>
        </div>
    );
};

export default Login;