// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Avatar,
  Toolbar,
  IconButton,
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
  useMediaQuery,
  Select,
  MenuItem,
  Menu,
} from "@mui/material";
import {
  Book as BookIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  NoteAdd as NoteAddIcon,
  Person as PersonIcon,
  Folder as FolderIcon,
  Bookmark as BookmarkIcon,
  Edit as EditIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "@mui/material/styles";

const Header = ({ isDarkMode, toggleTheme }) => {
  const { isLoggedIn, logout, user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dictionaryOption, setDictionaryOption] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    document.body.classList.toggle('dark-theme', isDarkMode);
    document.body.classList.toggle('light-theme', !isDarkMode);
  }, [isDarkMode]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "mn" : "en"));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setDrawerOpen(false);
  };

  const handleDictionaryChange = (event) => {
    const value = event.target.value;
    setDictionaryOption(value);
    if (value === "dictionary") {
      navigate("/dictionary");
    } else if (value === "wordle") {
      navigate("/wordle");
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const renderDrawerContent = () => (
    <Box sx={{ width: 250, backgroundColor: isDarkMode ? "#333" : "#F1F3FA", height: "100vh" }}>
      <Box sx={{ textAlign: "center", padding: 2, height: "100px" }}>
      <img
        src={isDarkMode ? "/logo_dark.png" : "/logo.png"}
        alt="Logo"
        style={{
          height: "80px", // Increased size
          maxHeight: "100px", // Ensures it doesn't get too big
          // width: "auto", // Maintains aspect ratio
          cursor: "pointer",
        }}
        onClick={() => {
          navigate("/")
          setDrawerOpen(false)
        }}
      />
      </Box>
      <Divider />
      <List>
        <ListItemButton onClick={() => {
          navigate("/dictionary")
          setDrawerOpen(false)
        }}>
          <ListItemIcon>
            <BookIcon />
          </ListItemIcon>
          <ListItemText primary={language === "en" ? "Terminology" : "Хууль зүйн нэр томьёо"} />
        </ListItemButton>
        <ListItemButton onClick={() => {
          navigate("/papers")
          setDrawerOpen(false)
        }}>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary={language === "en" ? "List of dissertations" : "Эрдмийн зэрэг хамгаалсан бүтээлийн жагсаалт"} />
        </ListItemButton>
        <ListItemButton onClick={() => {
          navigate("/sources")
          setDrawerOpen(false)
        }}>
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText primary={language === "en" ? "Finding sources" : "Эх сурвалж хайх"} />
        </ListItemButton>
        {!isLoggedIn && (
          <>
            <ListItemButton onClick={() => {
              navigate("/login")
              setDrawerOpen(false)
            }}>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary={language === "en" ? "Login" : "Нэвтрэх"} />
            </ListItemButton>
            <ListItemButton onClick={() => {
              navigate("/register")
              setDrawerOpen(false);
            }}>
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary={language === "en" ? "Register" : "Бүртгүүлэх"} />
            </ListItemButton>
          </>
        )}
        {isLoggedIn && (
          <>
            {(user?.role === "author" || user?.role === "journal") && (
              <ListItemButton onClick={() => {
                navigate("/add-document")
                setDrawerOpen(false);
              }}>
                <ListItemIcon>
                  <NoteAddIcon />
                </ListItemIcon>
                <ListItemText primary={language === "en" ? "Add Document" : "Бүтээл оруулах"} />
              </ListItemButton>
            )}
            <ListItemButton onClick={() => {
              navigate("/profile")
              setDrawerOpen(false);
            }}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={language === "en" ? "Profile" : "Хэрэглэгчийн булан"} />
            </ListItemButton>
            {(user?.role === "author" || user?.role === "journal") && (
              <ListItemButton onClick={() => {
                navigate("/my-documents")
                setDrawerOpen(false);
              }}>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText primary={language === "en" ? "My Documents" : "Миний бүтээлүүд"} />
              </ListItemButton>
            )}
            <ListItemButton onClick={() => {
              navigate("/favorites")
              setDrawerOpen(false);
            }}>
              <ListItemIcon>
                <BookmarkIcon />
              </ListItemIcon>
              <ListItemText primary={language === "en" ? "My library" : "Миний номын сан"} />
            </ListItemButton>
            {(user?.role === "admin" || user?.role === "editor") && (
              <ListItemButton onClick={() => {
                navigate("/dictionary-edit")
                setDrawerOpen(false);
              }}>
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText primary={language === "en" ? "Edit Terminology" : "Нэр томьёо засвар"} />
              </ListItemButton>
            )}
            {user?.role === "journal" && (
              <ListItemButton sx={{ fontWeight: "bold" }} onClick={() => {
                navigate("/edit-journal")
                setDrawerOpen(false);
              }}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary={language === "en" ? "Journal Section" : "Сэтгүүлийн булан"} />
              </ListItemButton>
            )}
            {user?.role === "admin" && (
              <ListItemButton sx={{ fontWeight: "bold" }} onClick={() => {
                navigate("/admin")
                setDrawerOpen(false);
              }}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary={language === "en" ? "Admin Dashboard" : "Админы самбар"} />
              </ListItemButton>
            )}
            {user?.role === "admin" && (
              <ListItemButton sx={{ fontWeight: "bold" }} onClick={() => {
                navigate("/adminusercontrol")
                setDrawerOpen(false);
              }}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary={language === "en" ? "Admin User Control" : "Админы хэрэглэгчийн самбар"} />
              </ListItemButton>
            )}
            <ListItemButton onClick={() => {
              handleLogout()
              setDrawerOpen(false);
            }}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={language === "en" ? "Logout" : "Гарах"} />
            </ListItemButton>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      {/* Main AppBar */}
      <AppBar position="sticky" sx={{ 
        backgroundColor: isDarkMode ? "#333" : "#F1F3FA", 
        boxShadow: "none"
      }}>
        <Toolbar sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          padding: "10px 16px"
        }}>
          {/* Left Section - Logo & Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton edge="start" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              {renderDrawerContent()}
            </Drawer>
            <img
              src={isDarkMode ? "/logo_dark.png" : "/logo.png"}
              alt="Logo"
              style={{ height: "80px", cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </Box>
  
          {/* Right Section - User Info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton 
                  onClick={toggleTheme} 
                  sx={{ 
                    color: isDarkMode ? "white" : "black",
                    "&:hover": {
                      backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                    }
                  }}
                >
                  {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                <IconButton 
                  onClick={toggleLanguage}
                  sx={{
                    color: isDarkMode ? "white" : "black",
                    "&:hover": {
                      backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                    }
                  }}
                >
                  <img
                    src={`/icons/${language === "en" ? "mongolia" : "english"}.png`}
                    alt={language}
                    style={{ width: 24, height: 24 }}
                  />
                </IconButton>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {isLoggedIn && (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#1F3985",
                        textTransform: "none",
                        fontWeight: "bold",
                        color: isDarkMode ? "white" : "white",
                        borderRadius: "20px",
                        "&:hover": { backgroundColor: "#162A63"}
                      }}
                      onClick={() => navigate("/favorites")}
                      startIcon={<BookmarkIcon />}
                    >
                      {language === "en" ? "My Library" : "Миний номын сан"}
                    </Button>
                  )}
                  {!isLoggedIn && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#1F3985",
                          textTransform: "none",
                          fontWeight: "bold",
                          color: "white",
                          borderRadius: "20px",
                          "&:hover": { backgroundColor: "#162A63" },
                        }}
                        onClick={() => navigate("/login")}
                      >
                        {language === "en" ? "Login" : "Нэвтрэх"}
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#1F3985",
                          color: "white",
                          textTransform: "none",
                          fontWeight: "bold",
                          borderRadius: "20px",
                          "&:hover": { backgroundColor: "#162A63" },
                        }}
                        onClick={() => navigate("/register")}
                      >
                        {language === "en" ? "Register" : "Бүртгүүлэх"}
                      </Button>
                    </Box>
                  )}
                  <Select
                    value=""
                    onChange={handleDictionaryChange}
                    displayEmpty
                    variant="outlined"
                    renderValue={() => language === "en" ? "Terminology" : "Хууль зүйн нэр томьёо"}
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      color: isDarkMode ? "white" : "black",
                      borderRadius: "20px",
                      backgroundColor: isDarkMode ? "#333" : "#F1F3FA",
                      "& .MuiSelect-icon": {
                        color: isDarkMode ? "white" : "black",
                      },
                    }}
                  >
                    <MenuItem value="dictionary">
                      {language === "en" ? "Terminology Dictionary" : "Нэр томьёоны толь"}
                    </MenuItem>
                    <MenuItem value="wordle">
                      {language === "en" ? "Terminology Game" : "Нэр томьёоны тоглоом"}
                    </MenuItem>
                  </Select>
                </Box>
              </Box>
            )}
  
            {/* User Section */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              {isLoggedIn && (
                <>
                  <Avatar
                    src={user?.profileImage}
                    alt="Profile"
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      backgroundColor: isDarkMode ? "#555" : "#E0E3EB",
                      cursor: "pointer",
                    }}
                    onClick={handleMenuOpen} // Open menu on click
                  >
                    {!user?.profileImage && <PersonIcon sx={{ color: isDarkMode ? "white" : "black" }} />}
                  </Avatar>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDarkMode ? "white" : "black",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {`${user?.lastname?.[0] || ""}.${user?.firstname || "Хэрэглэгч"}`}
                  </Typography>

                  {/* Dropdown Menu */}
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                  >
                    <MenuItem onClick={() => handleMenuClick("/profile")}>
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      Хэрэглэгчийн булан
                    </MenuItem>
                    {(user?.role === "author" || user?.role === "journal") && (
                      <MenuItem onClick={() => handleMenuClick("/my-documents")}>
                        <ListItemIcon>
                          <FolderIcon />
                        </ListItemIcon>
                        Миний бүтээлүүд
                      </MenuItem>
                    )}
                    {(user?.role === "author" || user?.role === "journal") && (
                      <MenuItem onClick={() => handleMenuClick("/add-document")}>
                        <ListItemIcon>
                          <NoteAddIcon />
                        </ListItemIcon>
                        Бүтээл оруулах
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => handleMenuClick("/favorites")}>
                      <ListItemIcon>
                        <BookmarkIcon />
                      </ListItemIcon>
                      Миний номын сан
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon />
                      </ListItemIcon>
                      Гарах
                    </MenuItem>
                  </Menu>
                </>
              )}
  
              
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Header;
