import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface AuthContextType {
  user: string | null;
  flickrUser: string | null;
  isAuthenticated: boolean;
  userInfo: any;
  setFlickrUser: (username: string) => void;
  checkAuth: () => void;
  setUserInfo: (userInfo: any) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [flickrUser, setFlickrUserState] = useState<string | null>(null);
  
  const [userInfo, setUserInfo] = useState<any>(null);

  const isAuthenticated = !!userInfo;

  const setFlickrUser = (username: string) => {
    setFlickrUserState(username);
    localStorage.setItem("flickrUser", username);
  };

  const checkAuth = useCallback(() => {
    const storedUser = localStorage.getItem("user");
    const storedFlickrUser = localStorage.getItem("flickrUser");

    if (storedUser) {
      setUser(storedUser);
    }
    if (storedFlickrUser) {
      setFlickrUserState(storedFlickrUser);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const contextObject = {
    user,
    flickrUser,
    isAuthenticated,
    userInfo,
    setFlickrUser,
    checkAuth,
    setUserInfo,
  };

  return (
    <AuthContext.Provider value={contextObject}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth should be used in AuthProvider.");
  }
  return context;
};