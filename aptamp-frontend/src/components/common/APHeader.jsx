import React from 'react';
import { Box, Container, Typography, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useTranslation } from 'react-i18next';
import LanguageSwitch from './LanguageSwitch';
import APTALogo from './APTALogo';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';




export default function APHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleDashboardRedirect = () => {
    const path = user?.role === 'PLAYER' || user?.role === 'COACH'
      ? '/player/dashboard'
      : '/admin/dashboard';
    navigate(path);
  };

  return (
    <Box
      sx={{
        bgcolor: '#002244', // Dark Navy
        color: '#ffffff',
        py: 1.5, // slightly more padding for the larger logo layout
        borderBottom: '3px solid #F4A300', // Gold border
        width: '100%',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={{ xs: 1.5, md: 0 }}
        >
          {/* LEFT: logos + text */}
          <Stack direction="row" alignItems="center" spacing={2.5} sx={{ width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <APTALogo />
            </Stack>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '1.05rem', md: '1.2rem' },
                  color: '#F4A300', // Gold title
                  fontFamily: "'Noto Serif', Georgia, serif",
                  lineHeight: 1.1,
                  letterSpacing: '0.2px'
                }}
              >
                {t('hero.title')}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#cbd5e1',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'block',
                  mt: 0.2
                }}
              >
                {t('header.subtitle')}
              </Typography>
            </Box>
          </Stack>

          {/* RIGHT: Login | Register | Language */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              width: { xs: '100%', md: 'auto' },
              justifyContent: { xs: 'center', md: 'flex-end' }
            }}
          >
            {isAuthenticated ? (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DashboardIcon fontSize="small" />}
                  onClick={handleDashboardRedirect}
                  sx={{
                    color: '#F4A300',
                    borderColor: '#F4A300',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '0.78rem',
                    py: 0.5,
                    px: 1.8,
                    '&:hover': {
                      borderColor: '#ffffff',
                      color: '#ffffff',
                      bgcolor: 'rgba(244, 163, 0, 0.1)'
                    }
                  }}
                >
                  {t('player.dashboard')}
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<LogoutIcon fontSize="small" />}
                  onClick={handleLogout}
                  sx={{
                    bgcolor: '#FF6600',
                    color: '#ffffff',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '0.78rem',
                    py: 0.5,
                    px: 1.8,
                    '&:hover': {
                      bgcolor: '#d95300'
                    }
                  }}
                >
                  {t('auth.logout')}
                </Button>
              </Stack>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<LoginIcon fontSize="small" />}
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#F4A300',
                    borderColor: '#F4A300',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '0.78rem',
                    py: 0.5,
                    px: 1.8,
                    '&:hover': {
                      borderColor: '#ffffff',
                      color: '#ffffff',
                      bgcolor: 'rgba(244, 163, 0, 0.1)'
                    }
                  }}
                >
                  {t('auth.login')}
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PersonAddIcon fontSize="small" />}
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: '#FF6600',
                    color: '#ffffff',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '0.78rem',
                    py: 0.5,
                    px: 1.8,
                    '&:hover': {
                      bgcolor: '#d95300'
                    }
                  }}
                >
                  {t('auth.register')}
                </Button>
              </Stack>
            )}
            <Box sx={{ borderLeft: '1px solid rgba(255, 255, 255, 0.2)', pl: 1.5, display: 'flex', alignItems: 'center' }}>
              <LanguageSwitch />
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
