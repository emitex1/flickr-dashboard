import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  flickrUser: string | null;
  isAuthenticated: boolean;
  userInfo: any;
  setFlickrUser: (username: string) => void;
  setUserInfo: (userInfo: any) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [flickrUser, setFlickrUserState] = useState<string | null>(null);

  const isAuthenticated = !!userInfo;

  const setFlickrUser = (username: string) => {
    setFlickrUserState(username);
    localStorage.setItem("flickrUser", username);
  };

  const contextObject = {
    userInfo,
    isAuthenticated,
    flickrUser,
    setUserInfo,
    setFlickrUser,
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