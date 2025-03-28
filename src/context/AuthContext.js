import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AuthContext = createContext();
console.log("AuthContext created:", AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const onboardingStatus = await AsyncStorage.getItem(
          "onboardingCompleted"
        );
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          if (onboardingStatus === "true") setOnboardingCompleted(true);
          const response = await axios.get(
            "http://localhost:8000/api/auth/user"
          );
          if (response.status === 200) {
            setUser({ ...response.data.user, token });
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error verifying token:", error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  const signup = async (signupData, navigation) => {
    const { email, username, password } = signupData;
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/signup",
        {
          email,
          username,
          password,
        }
      );
      await AsyncStorage.setItem("onboardingCompleted", "false");
      navigation.navigate("Login");
      return response;
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      throw error;
    }
  };

  const login = async (username, password) => {
    try {
      console.log("attempting to log in");
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        { email: username, password }
      );
      const { token } = response.data;
      await AsyncStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser({ ...user, token });

      const onboardingStatus = await AsyncStorage.getItem(
        "onboardingCompleted"
      );
      setOnboardingCompleted(onboardingStatus === "true");

      const userResponse = await axios.get("http://localhost:8000/api/auth/user");
      setUser({ ...userResponse.data.user, token });

    } catch (error) {
      console.error("Login error:", error.message);
      throw new Error("Login failed. Please check your credentials.");
    }
  };

  const updateUser = async (updatedUserData) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated.");
      }

      const response = await axios.put(
        `http://localhost:8000/api/auth/user/${user.id}`,
        updatedUserData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser({ ...user, ...response.data.user });
      console.log("User updated successfully:", response.data.user);
    } catch (error) {
      console.error("Error updating user:", error.message);
      throw error;
    }
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem("onboardingCompleted", "true");
    setOnboardingCompleted(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("onboardingCompleted");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setOnboardingCompleted(true);
    // setOnboardingCompleted(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        signup,
        login,
        logout,
        onboardingCompleted,
        completeOnboarding,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
