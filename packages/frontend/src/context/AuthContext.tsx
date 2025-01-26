import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  firebaseUser: any;
  isAuthenticated: boolean;
  setFirebaseUser: (userInfo: any) => void;
  getFlickrUserName: () => string | undefined;
  setFlickrUser: (username: string | undefined) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [flickrUser, setFlickrUserState] = useState<string | null>(null);

  const isAuthenticated = !!firebaseUser;

  const getFlickrUserName = () => {
    return flickrUser || localStorage.getItem('flickrUser') || undefined;
  }
  const setFlickrUser = (username: string | undefined) => {
    setFlickrUserState(username || '');
    if (username === undefined) {
      localStorage.removeItem("flickrUser");
    } else {
      localStorage.setItem("flickrUser", username);
    }
  };

  const contextObject = {
    firebaseUser,
    isAuthenticated,
    setFirebaseUser,
    getFlickrUserName,
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