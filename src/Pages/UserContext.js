// UserContext.js
import React, { createContext, useContext } from "react";
import { useKeycloak } from "@react-keycloak/web";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { keycloak, initialized } = useKeycloak();

  // Define your Keycloak client name (as it appears in Keycloak)
  const CLIENT_ID = "legal-wing"; // <-- Update this to your actual client name

  const user = initialized && keycloak.authenticated
    ? {
        firstName: keycloak.tokenParsed?.given_name || "Unknown",
        lastName: keycloak.tokenParsed?.family_name || "",
        username: keycloak.tokenParsed?.preferred_username,
        roles:
          keycloak.tokenParsed?.resource_access?.[CLIENT_ID]?.roles || []
      }
    : null;

  console.log("User:", user);
  console.log("User roles:", user?.roles);

  const logout = () => {
    keycloak.logout();
  };

  return (
    <UserContext.Provider value={{ user, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
