import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider mounted"); // This will confirm if the AuthProvider is being used correctly
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (fireUser) => {
      if (fireUser) {
        console.log("User authenticated:", fireUser);
        setUser(fireUser); // Set the authenticated user
      } else {
        console.log("No user authenticated");
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      console.log("AuthProvider unmounted, cleaning up");
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Exporting useAuth to access the context in other components
export const useAuth = () => useContext(AuthContext);