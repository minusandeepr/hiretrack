import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import authAPI from "../api/auth.api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (token) {
          const profile = await authAPI.getMe();
          setUser(profile.data.data.user);
        }
      } catch (err) {
        console.log(err);
        localStorage.removeItem("accessToken");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await authAPI.login({ email, password });

    console.log("FULL RESPONSE:", response);
    console.log("RESPONSE.DATA:", response.data);
    console.log("ACCESS TOKEN:", response.data.data.accessToken);

    localStorage.setItem(
      "accessToken",
      response.data.data.accessToken
    );

    console.log(
      "LOCAL STORAGE:",
      localStorage.getItem("accessToken")
    );

    const profile = await authAPI.getMe();
    setUser(profile.data.data.user);
  }, []);

  const register = useCallback(async (name, email, password) => {
    return authAPI.register({ name, email, password });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch { }

    localStorage.removeItem("accessToken");
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

export default AuthContext;