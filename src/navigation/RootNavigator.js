import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import AuthContext from "../context/AuthContext";
import OnboardingNavigator from "./OnboardingNavigator";

const RootNavigator = () => {
  // const onboardingCompleted = true;
  // const { user, loading } = useContext(AuthContext);
  const { user, loading, onboardingCompleted } = useContext(AuthContext);

  useEffect(() => {
    console.log("RootNavigator rendered:", {
      user,
      loading,
      onboardingCompleted,
    });
  }, [user, loading, onboardingCompleted]);

  if (loading) {
    console.log("Loading state is true. Showing loading indicator...");
    return null;
  }

  console.log("User authenticated:", !!user);

  return (
    <>
      <NavigationContainer>
        {user ? (
          onboardingCompleted ? (
            <AppNavigator />
          ) : (
            <OnboardingNavigator />
          )
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
    </>
  );
};

export default RootNavigator;
