import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserContext } from "./Context";
import { get } from "./Network";

// Interfaces
import { UserData, RequestResponse } from "./Interfaces";

// Components
import Header from "./components/other/Header";
import Welcome from "./components/user/Welcome";
import Signup from "./components/user/Signup";
import Signin from "./components/user/Signin";
import Dashboard from "./components/main/Dashboard";
import Profile from "./components/user/Profile";
import { NoPage } from "./components/other/NoPage";

function App(): React.ReactElement {
  // Context
  const [user, setUser] = useState<UserData>(undefined);

  // Environment variables are as easy as that! Just don't forget to prefix them with VITE_.
  // console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("Running in development environment.")
    }

    const tempUser = JSON.parse(localStorage.getItem("ziScreenUser") || "{}")
    if (!tempUser.token) {
      setUser(null)
      return
    }

    setUser(tempUser)
    updateUser(tempUser)

    // Update user
    interface responseType {
      // logs: Log[],
      // projects: Project[]
    }
    async function updateUser(tempUser: UserData): Promise<void> {
      const response: RequestResponse<responseType> = await get("auth/get-updates", { token: tempUser?.token })
      if (response.success && tempUser?.username) {
        setUser({
          ...tempUser,
        })
      }
    }
  }, [])

  useEffect(() => {
    if (user === undefined) {
      return
    }
    if (user?.token) {
      localStorage.setItem("ziScreenUser", JSON.stringify(user))
      console.log("User changed.")
    } else {
      localStorage.removeItem("ziScreenUser")
      console.log("Signed out.")
    }
  }, [user])


  // Component
  if (user === null || user === undefined) {
    return (
      <UserContext.Provider value={[user, setUser]}>
        <BrowserRouter basename="ziscreen">
          <Routes>
            <Route path="/" element={<Header />}>
              <Route index element={<Welcome />} />
              <Route path="sign-up" element={<Signup />} />
              <Route path="sign-in" element={<Signin />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    )

  }
  return (
    <UserContext.Provider value={[user, setUser]}>
      <BrowserRouter basename="ziscreen">
        <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;