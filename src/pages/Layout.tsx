// /src/pages/Layout.tsx

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { NavLink, Outlet } from "react-router-dom";
import { CSSProperties, useState } from "react";

//MenuItemsの型定義
type menuItem = {
  text: string;
  path: string;
  icon: React.ComponentType;
};

const drawerWidth = 240;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  //MenuItems関連定義
  const MenuItems: menuItem[] = [
    { text: "Home", path: "/", icon: HomeIcon },
    { text: "Report", path: "/report", icon: QueryStatsIcon },
  ];

  //MenuItemsのCSS指定
  const baseLinkStyle: CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  };
  const activeLinkStyle: CSSProperties = {
    backgroundColor: "rgba(0,0,0,0.08)",
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
      {MenuItems.map((item, index) => (
          <NavLink//NavLinkによるリンク定義
            key={item.text}
            to={item.path}
            style={({ isActive }) => {
              //styleはオブジェクトの為、スプレッド構文...で展開、isActiveは、NavLinkのプロパティ
              return {
                ...baseLinkStyle,
                ...(isActive ? activeLinkStyle : {}),
              };
            }}
          >
            <ListItem key={index} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </NavLink>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      sx={{
        display: { md: "flex" },
        bgcolor: (theme) => theme.palette.grey[50], 
        minHeight: "100vh", 
      }}
    >
      <CssBaseline />

      {/* ヘッダー */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` }, //ブレイクポイントをsmからmdに
          ml: { md: `${drawerWidth}px` },//ブレイクポイントをsmからmdに
          backgroundColor: "#9dc094", 
          boxShadow: "none", 
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}//ブレイクポイントをsmからmdに
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Daily Tracker App
          </Typography>
        </Toolbar>
      </AppBar>

      {/* サイドバー */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}//ブレイクポイントをsmからmdに
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        {/* モバイル用 */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" }, //ブレイクポイントをsmからmdに
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* PC用 */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },  //ブレイクポイントをsmからmdに
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` }, //ブレイクポイントをsmからmdに
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
