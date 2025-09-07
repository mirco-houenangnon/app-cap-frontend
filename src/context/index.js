import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({
  role: null,
  nom: null,
  prenoms: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [nom, setNom] = useState(null);
  const [prenoms, setPrenoms] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedNom = localStorage.getItem("nom");
    const storedPrenoms = localStorage.getItem("prenoms");

    if (storedToken && storedRole) {
      setIsAuthenticated(true);
      setRole(storedRole);
      setNom(storedNom);
      setPrenoms(storedPrenoms);
    }
  }, []);

  const login = (token, userNom, userPrenoms, userRole) => {
    localStorage.setItem("token", token);
    localStorage.setItem("nom", userNom);
    localStorage.setItem("prenoms", userPrenoms);
    localStorage.setItem("role", userRole);
    setNom(userNom);
    setPrenoms(userPrenoms);
    setRole(userRole);
    setIsAuthenticated(true);
    navigate("/portail");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("nom");
    localStorage.removeItem("prenoms");
    setIsAuthenticated(false);
    setRole(null);
    setNom(null);
    setPrenoms(null);
    navigate("/portail");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, nom, prenoms, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider };