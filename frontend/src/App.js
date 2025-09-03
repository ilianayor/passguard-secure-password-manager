import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/authentication/Login";
import Signup from "./components/authentication/Signup";
import AllPasswords from "./components/passwords/AllPasswords";
import PasswordDetails from "./components/passwords/PasswordDetails";
import CreatePassword from "./components/passwords/CreatePassword";
import UpdatePassword from "./components/passwords/UpdatePassword";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./components/LandingPage";
import AccessDenied from "./components/authentication/AccessDenied";
import Admin from "./components/auditlog/Admin";
import UserProfile from "./components/authentication/UserProfile";
import ForgotPassword from "./components/authentication/ForgotPassword";
import { Toaster } from "react-hot-toast";
import NotFound from "./components/NotFound";
import ContactPage from "./components/contact/ContactPage";
import AboutPage from "./components/about/AboutPage";
import ResetPassword from "./components/authentication/ResetPassword";
import Footer from "./components/footer/Footer";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Toaster position="bottom-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/passwords/:id"
          element={
            <ProtectedRoute>
              <PasswordDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passwords"
          element={
            <ProtectedRoute>
              <AllPasswords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-password"
          element={
            <ProtectedRoute>
              <CreatePassword />
            </ProtectedRoute>
          }
        />

        <Route path="/edit-password/:id" element={<UpdatePassword />} />
        
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute adminPage={true}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;