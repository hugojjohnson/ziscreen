import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserContext } from "./Context";
import { get } from "./Network";

// Interfaces
import { UserData, RequestResponse, Sentence, Token } from "./Interfaces";

// Components
import Header from "./components/other/Header";
import Welcome from "./components/user/Welcome";
import Signup from "./components/user/Signup";
import Signin from "./components/user/Signin";
import Dashboard from "./components/main/Dashboard";
import Profile from "./components/user/Profile";
import { NoPage } from "./components/other/NoPage";
import Add from "./components/main/Add";
import Practice from "./components/main/Practice";

function App(): React.ReactElement {
  // Context
  const [user, setUser] = useState<UserData>(undefined);

  // Environment variables are as easy as that! Just don't forget to prefix them with VITE_.
  // like this: (import.meta.env.VITE_GOOGLE_CLIENT_ID)

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.debug("Running in a dev environment.")
    } else {
      console.debug("Running in a prod environment.")
    }

    const tempUser = JSON.parse(localStorage.getItem("ziScreenUser") || "{}")
    if (!tempUser.token) {
      setUser(null)
      return
    }

    // setUser(tempUser)
    updateUser(tempUser)

    // Update user
    interface responseType {
      sentences: Sentence[];
      tokens: Token[];
      daily_date: string;
      daily_tokens: string[];
    }

    async function updateUser(tempUser: UserData): Promise<void> {
      const response: RequestResponse<responseType> = await get("main/get-updates", { token: tempUser?.token })
      if (response.success && tempUser?.username) {
        setUser({
          ...tempUser,
          sentences: response.data.sentences,
          tokens: response.data.tokens,
          daily_date: response.data.daily_date,
          daily_tokens: response.data.daily_tokens
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
    } else {
      localStorage.removeItem("ziScreenUser")
    }
  }, [user])


  // Component
  if (user === undefined) {
    return <div className="flex flex-col items-center w-full h-screen"><img className="pt-56 w-56" src="/media/loading.jpg" alt="loading"/></div> // TODO: Make a loading screen
  }
  if (user === null) {
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
            <Route path="add" element={<Add />} />
            <Route path="practice" element={<Practice />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;