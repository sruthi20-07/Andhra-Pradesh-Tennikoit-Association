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
  Avatar,
  Typography,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';
import CommentIcon from '@mui/icons-material/Comment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { logout } from '../../store/slices/authSlice';
import APHeader from '../common/APHeader';

const drawerWidth = 260;

export default function PlayerLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notification);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const menuItems = [
    { text: t('player.dashboard'), icon: <HomeIcon />, path: '/player/dashboard' },
    { text: t('player.profile'), icon: <PersonIcon />, path: '/player/profile' },
    { text: t('player.tournaments'), icon: <EmojiEventsIcon />, path: '/player/tournaments' },
    { text: t('player.myRegistrations'), icon: <AssignmentIcon />, path: '/player/my-registrations' },
    { text: t('player.rankings'), icon: <LeaderboardIcon />, path: '/player/rankings' },
    { text: t('player.myRank'), icon: <LeaderboardIcon />, path: '/player/my-ranking' },
    { text: t('player.gallery'), icon: <PhotoLibraryIcon />, path: '/player/gallery' },
    { text: t('player.calendar'), icon: <CalendarMonthIcon />, path: '/player/calendar' },
    { text: t('player.downloads'), icon: <FileDownloadIcon />, path: '/player/downloads' },
    { text: t('player.notifications'), icon: <NotificationsIcon />, path: '/player/notifications', badge: unreadCount },
    { text: t('player.payments'), icon: <PaymentIcon />, path: '/player/payments' },
    { text: t('player.feedback'), icon: <CommentIcon />, path: '/player/feedback' },
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#003366', color: '#ffffff' }}>
      {/* User Info Block */}
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Avatar
          src={user?.photoUrl || ''}
          alt={user?.name || 'Player'}
          sx={{ width: 72, height: 72, mb: 1.5, border: '2px solid #F4A300' }}
        />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: '0.3px', mb: 0.5 }}>
          {user?.name || 'AP Athlete'}
        </Typography>
        <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'block', mb: 0.5, fontFamily: 'monospace' }}>
          ID: {user?.id ? `APTAMP-${user.id}` : 'N/A'}
        </Typography>
        <Box sx={{ bgcolor: '#F4A300', color: '#003366', px: 1.5, py: 0.3, borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
          {user?.district || 'AP STATE'}
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Navigation Links */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List sx={{ px: 1.5, py: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
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
                    bgcolor: isActive ? 'rgba(0, 87, 168, 0.2)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                    },
                    py: 1,
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#F4A300' : '#cbd5e1', minWidth: 40 }}>
                    {item.badge ? (
                      <Badge badgeContent={item.badge} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
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

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
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

      {/* Mobile Top Navbar */}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: '#0057A8',
          display: { md: 'none' },
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
            APTA Athlete Portal
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Navigation Sidebar for desktop */}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          aria-label="mailbox folders"
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

        {/* Content Pane */}
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
