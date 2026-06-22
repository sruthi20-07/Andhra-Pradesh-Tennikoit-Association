import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  Button,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import CollectionsIcon from '@mui/icons-material/Collections';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { logout } from '../../store/slices/authSlice';
import APHeader from '../common/APHeader';

const drawerWidth = 260;

export default function AdminLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const adminMenu = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Player Management', icon: <PeopleAltIcon />, path: '/admin/players' },
    { text: 'Tournament Management', icon: <EmojiEventsIcon />, path: '/admin/tournaments' },
    { text: 'Tournament Registrations', icon: <EmojiEventsIcon />, path: '/admin/registrations' },
    { text: 'Gallery Management', icon: <CollectionsIcon />, path: '/admin/gallery' },
    { text: 'Contact Queries', icon: <NotificationsActiveIcon />, path: '/admin/contacts' },
    { text: 'Feedback Management', icon: <StarIcon />, path: '/admin/feedbacks' },
    { text: 'Downloads Management', icon: <DownloadForOfflineIcon />, path: '/admin/downloads' },
    { text: 'Settings', icon: <SettingsApplicationsIcon />, path: '/admin/settings' },
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#0B1A30', color: '#ffffff' }}>
      {/* Admin Info Header */}
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Box sx={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          bgcolor: '#F4A300',
          color: '#003366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '1.25rem',
          mb: 1.5,
          border: '1.5px solid #ffffff'
        }}>
          {user?.name?.charAt(0) || 'A'}
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: '#ffffff' }}>
          {user?.name || 'Administrator'}
        </Typography>
        <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#F4A300', px: 1.5, py: 0.3, borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800 }}>
          {user?.role || 'APTA ADMIN'}
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* Nav List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List sx={{ px: 1.5, py: 2 }}>
          {adminMenu.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: '4px',
                    borderLeft: isActive ? '4px solid #F4A300' : '4px solid transparent',
                    bgcolor: isActive ? 'rgba(244, 163, 0, 0.1)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.03)',
                    },
                    py: 1,
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#F4A300' : '#cbd5e1', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.88rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#F4A300' : '#ffffff',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
      {/* Logout button at bottom */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: '4px',
            '&:hover': {
              bgcolor: 'rgba(192, 57, 43, 0.15)',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#ff7878', minWidth: 40 }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 600, color: '#ff7878' }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F5F7FA' }}>
      <APHeader />

      {/* Top Navbar */}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: '#003366',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
              APTAMP — Administrative Control Center
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleLogout}
            startIcon={<ExitToAppIcon />}
            sx={{
              borderColor: 'rgba(255,255,255,0.4)',
              color: '#ffffff',
              '&:hover': {
                borderColor: '#ffffff',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
              fontSize: '0.75rem',
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Navigation Sidebar for desktop */}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          {/* Mobile responsive drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawerContent}
          </Drawer>

          {/* Desktop permanent drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, position: 'relative', height: '100%' },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        </Box>

        {/* Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2.5, md: 4 },
            width: { md: `calc(100% - ${drawerWidth}px)` },
            bgcolor: '#ffffff',
            minHeight: '80vh',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.03)',
            borderLeft: '1px solid #D1D9E0',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
