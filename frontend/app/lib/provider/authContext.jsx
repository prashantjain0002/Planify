import { createContext, useContext, useEffect, useState } from "react";
import { queryClient } from "./reactQueryProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { publicRoutes } from "..";
import Loader from "@/components/Loader";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  const isPublicRoute = publicRoutes.includes(currentPath);

  useEffect(() => {
    const checkAuth = async () => {
      const userInfo = localStorage.getItem("user");
      if (userInfo) {
        setUser(JSON.parse(userInfo));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        if (!isPublicRoute) {
          navigate("/sign-in");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [currentPath, isPublicRoute, navigate]);

  const login = async (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    setIsAuthenticated(true);
    window.location.replace("/dashboard");
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    queryClient.clear();
    window.location.replace("/");
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  } else {
    return context;
  }
};
