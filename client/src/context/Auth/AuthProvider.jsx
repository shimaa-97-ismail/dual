import { AuthContext } from "./AuthContext";
import { useState, useEffect } from "react";
import { axioInstance } from "../../api/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (data) => {
    // console.log("data",data);
    
    try {
      const response = await axioInstance.post("/user/login", { data });
      console.log(response);
       if (response.status === 200) {
      toast.success("you are login !");
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      setUser(response.data.data);
      navigate("/dashboard")
    } 
      
    } catch (err) {
       toast.error(err.response?.data?.message);
      // console.log(err.response?.data?.message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      axioInstance
        .get("/user/me", {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((res) => {
          setUser(res.data.user);
          setToken(storedToken);
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
      
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
