import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import APTALogo from './APTALogo';
import { useTranslation } from 'react-i18next';

export default function APNavbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/committee', label: t('nav.committee') },
    { path: '/tournaments', label: t('nav.tournaments') },
    { path: '/rankings', label: t('nav.rankings') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/calendar', label: t('nav.calendar') },
    { path: '/downloads', label: t('nav.downloads') },
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#0057A8', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', top: 0, zIndex: 1100 }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '50px !important', px: { xs: 2, md: 3 } }}>
        {/* Left Side: Mobile Toggle & Desktop/Mobile Branding */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Navbar Branding */}
          <Box
            component={NavLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              textDecoration: 'none',
              color: '#ffffff'
            }}
          >
            <APTALogo size={35} style={{ display: 'block' }} />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.5px',
                fontFamily: "'Noto Serif', Georgia, serif",
                fontSize: { xs: '0.85rem', sm: '1rem' }
              }}
            >
              APTA
            </Typography>
          </Box>
        </Box>

        {/* Desktop Links (Right Side) */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3.5 }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className="nav-item"
            >
              {link.label}
            </NavLink>
          ))}
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, bgcolor: '#003366', color: '#ffffff' },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Mobile menu header with Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <APTALogo size={32} />
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#F4A300', fontFamily: "'Noto Serif', Georgia, serif" }}>
              APTA Portal
            </Typography>
          </Box>
          <IconButton onClick={handleDrawerToggle} color="inherit">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <List sx={{ px: 2 }}>
          {navLinks.map((link) => (
            <ListItem key={link.path} disablePadding>
              <ListItemButton
                component={NavLink}
                to={link.path}
                onClick={handleDrawerToggle}
                sx={{
                  py: 1.5,
                  borderRadius: 1,
                  '&.active': {
                    bgcolor: 'rgba(244, 163, 0, 0.15)',
                    color: '#F4A300',
                  },
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.5px' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}

