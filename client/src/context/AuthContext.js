import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decodedToken = JSON.parse(atob(storedToken.split(".")[1]));
      const isExpired = decodedToken.expiration * 1000 < new Date().getTime();

      if (isExpired) {
        logout();
      } else {
        setIsLoggedIn(true);
        setToken(storedToken);
        setEmail(decodedToken.email);
      }
    }
  }, []);

  function login(newToken) {
    const decodedToken = JSON.parse(atob(newToken.split(".")[1]));
    setIsLoggedIn(true);
    setToken(newToken);
    setEmail(decodedToken.email);
    localStorage.setItem("token", newToken);
  }

  function logout() {
    setIsLoggedIn(false);
    setToken(null);
    setEmail("");
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
