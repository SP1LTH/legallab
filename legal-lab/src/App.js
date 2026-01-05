// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import "./App.css";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import DocumentDetail from "./components/DocumentDetail";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import AuthorOrJournalRoute from "./components/AuthorOrJournalRoute";
import { AuthProvider } from "./context/AuthContext";
import AddDocument from "./components/AddDocument";
import DocumentReader from "./components/DocumentReader";
import AdminDashboard from "./components/AdminDashboard";
import AdminUserControl from "./components/AdminUserControl";
import ApproveDocuments from "./components/ApproveDocuments";
import Profile from "./components/Profile";
import MyDocuments from "./components/MyDocuments";
import EditDocument from "./components/EditDocument";
import Favorites from "./components/Favorites";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from './components/ResetPassword';
import NotFound from './components/NotFoundPage';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import Dictionary from './components/Dictionary';
import DictionaryEdit from './components/DictionaryEdit';
import DictionaryCreate from './components/DictionaryCreate';
import Papers from './components/Papers';
import Sources from './components/Sources';
import Wordle from './components/Wordle';
import Journal from './components/Journal';
import EditJournal from './components/EditJournal';
import { lightTheme, darkTheme } from "./theme"; // Import themes
import { LanguageProvider } from "./context/LanguageContext";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvEH0_blrvZWvK8XniMToLWYLpdiX-NUk",
  authDomain: "legal-lab-77836.firebaseapp.com",
  projectId: "legal-lab-77836",
  storageBucket: "legal-lab-77836.firebasestorage.app",
  messagingSenderId: "241709084968",
  appId: "1:241709084968:web:c37c806f3954a7b966e01d",
  measurementId: "G-2CXK5ZZFYH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode toggle

  // Toggle function for dark and light themes
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <LanguageProvider>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        {" "}
        {/* Apply theme */}
        <AuthProvider>
          <CssBaseline />
          <Router>
            <div className="container">
              <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />{" "}
              {/* Pass props */}
              <div className="main">
                <Routes>
                  <Route path='*' element={<NotFound />} />
                  <Route path="/" element={<HomePage isDarkMode={isDarkMode} />} />
                  <Route path="/documents/:id" element={<DocumentDetail />} />
                  <Route path="/login" element={<Login isDarkMode={isDarkMode} />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/register" element={<Register isDarkMode={isDarkMode} />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/dictionary" element={<Dictionary />} />
                  <Route path="/papers" element={<Papers />} />
                  <Route path="/sources" element={<Sources />} />
                  <Route path="/wordle" element={<Wordle />} />
                  <Route path="/journal" element={<Journal />} />

                  {/* Private Routes */}
                  <Route
                    path="/favorites"
                    element={
                      <PrivateRoute>
                        <Favorites />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/documents/edit/:id"
                    element={
                      <PrivateRoute>
                        <EditDocument />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/my-documents"
                    element={
                      <AuthorOrJournalRoute>
                        <MyDocuments />
                      </AuthorOrJournalRoute>
                    }
                  />
                  <Route
                    path="/add-document"
                    element={
                      <AuthorOrJournalRoute>
                        <AddDocument isDarkMode={isDarkMode} />
                      </AuthorOrJournalRoute>
                    }
                  />
                  <Route
                    path="/documents/read/:id"
                    element={
                      <PrivateRoute>
                        <DocumentReader />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/dictionary-edit"
                    element={
                      <PrivateRoute>
                        <DictionaryEdit />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/dictionary-create"
                    element={
                      <PrivateRoute>
                        <DictionaryCreate />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/edit-journal"
                    element={
                      <PrivateRoute>
                        <EditJournal />
                      </PrivateRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/approve-documents"
                    element={
                      <AdminRoute>
                        <ApproveDocuments />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/adminusercontrol"
                    element={
                      <AdminRoute>
                        <AdminUserControl />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </div>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
