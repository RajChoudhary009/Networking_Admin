import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { UserContaxt } from "../src/store/userData";

import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { About } from "./components/about";
// import { Services } from "./components/services";
// import { Gallery } from "./components/gallery";
// import { Testimonials } from "./components/testimonials";
// import { Team } from "./components/Team";
import { Contact } from "./components/contact";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
// import { UserProfile } from "./screen/UserProfile"
import { Account } from "./screen/Account"
import Login from "./Auth/Login";
import Signup from "./Auth/Sinup";
import RefSinup from "./Auth/RefSinup"
import AdminScanner from "./screen/AdminScanner";
import UsersPage from "./screen/UsersPage"
import NotFound from "./screen/NotFound";
import "./App.css";

// Smooth scroll for internal links
export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const PrivateRoute = () => {
  const { userData } = useContext(UserContaxt)

  const token = localStorage.getItem("global_user_token");

  if (userData && userData.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});

  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <BrowserRouter>
      <Navigation />
      <Routes>

        <Route path="/signup" element={<Signup />} />
        <Route path="/ref-signup/:referralCode?" element={<RefSinup />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route
            path="/"
            element={
              <div>
                <Header data={landingPageData.Header} />
                <Features data={landingPageData.Features} />
                <About data={landingPageData.About} />
                {/* <Services data={landingPageData.Services} /> */}
                {/* <Gallery data={landingPageData.Gallery} /> */}
                {/* <Testimonials data={landingPageData.Testimonials} /> */}
                {/* <Team data={landingPageData.Team} /> */}
                <Contact data={landingPageData.Contact} />
              </div>
            }
          />
          {/* New user page route */}
          {/* <Route path="/user" element={<UserProfile />} /> */}
          <Route path="/fund-status" element={<Account />} />
          <Route path="/scanner" element={<AdminScanner />} />
          <Route path="/users" element={<UsersPage />} />

          {/* 🔥 404 for private routes */}
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* 🔥 404 for public routes */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;