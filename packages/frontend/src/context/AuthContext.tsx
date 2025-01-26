import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  firebaseUser: any;
  isAuthenticated: boolean;
  flickrUser: string | null;
  setFirebaseUser: (userInfo: any) => void;
  setFlickrUser: (username: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [flickrUser, setFlickrUserState] = useState<string | null>(null);

  const isAuthenticated = !!firebaseUser;

  const setFlickrUser = (username: string) => {
    setFlickrUserState(username);
    localStorage.setItem("flickrUser", username);
  };

  const contextObject = {
    firebaseUser,
    isAuthenticated,
    flickrUser,
    setFirebaseUser,
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