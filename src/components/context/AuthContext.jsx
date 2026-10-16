import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const ACCESS_TOKEN_KEY = "access_token";
const TOKEN_TYPE_KEY = "token_type";
const AUTH_USER_KEY = "auth_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [tokenType, setTokenType] = useState("bearer");
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const storedTokenType = localStorage.getItem(TOKEN_TYPE_KEY);
      const storedUser = localStorage.getItem(AUTH_USER_KEY);

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedTokenType) {
        setTokenType(storedTokenType);
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error restaurando sesión:", error);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(TOKEN_TYPE_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      setToken(null);
      setTokenType("bearer");
      setUser(null);
    } finally {
      setIsBootstrapping(false);
    }
  }, []);

  const login = (authData) => {
    const nextToken = authData?.access_token ?? null;
    const nextTokenType = authData?.token_type ?? "bearer";
    const nextUser = authData?.user ?? null;

    if (!nextToken) {
      throw new Error("No se recibió access_token al iniciar sesión");
    }

    if (!nextUser?.id) {
      throw new Error("No se recibió un usuario válido al iniciar sesión");
    }

    setToken(nextToken);
    setTokenType(nextTokenType);
    setUser(nextUser);

    localStorage.setItem(ACCESS_TOKEN_KEY, nextToken);
    localStorage.setItem(TOKEN_TYPE_KEY, nextTokenType);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
  };

  const logout = () => {
    setToken(null);
    setTokenType("bearer");
    setUser(null);

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(TOKEN_TYPE_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const isAuthenticated = !!token && !!user;
  const role = user?.role ?? null;
  const userId = user?.id ?? null;

  const value = useMemo(
    () => ({
      token,
      tokenType,
      user,
      userId,
      role,
      isAuthenticated,
      isBootstrapping,
      login,
      logout,
    }),
    [token, tokenType, user, userId, role, isAuthenticated, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
}