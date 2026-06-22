import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Card, CardContent, Typography, Box, Button } from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { useTranslation } from 'react-i18next';

export default function ProtectedRoute({ allowedRoles }) {
  const { t } = useTranslation();
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);

  // Fallback check against localStorage
  const storedToken = localStorage.getItem('aptamp_token');
  const storedUserRaw = localStorage.getItem('aptamp_user');
  let storedUser = null;
  try {
    storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
  } catch (e) {}

  const activeAuth = isAuthenticated || !!storedToken;
  const activeUser = user || storedUser;

  if (!activeAuth) {
    return <Navigate to="/login" replace />;
  }

  // Support checking mapped list of roles
  if (allowedRoles) {
    const userRole = activeUser?.role?.toUpperCase();
    const isAllowed = allowedRoles.some((role) => {
      const targetRole = role.toUpperCase();
      if (targetRole === 'ROLE_PLAYER' && (userRole === 'PLAYER' || userRole === 'COACH')) return true;
      if (targetRole === 'ROLE_ADMIN' && ['ADMIN', 'SUPER_ADMIN', 'APTA_ADMIN', 'DISTRICT_ADMIN'].includes(userRole)) return true;
      return userRole === targetRole;
    });

    if (!isAllowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Under review check for player registrations
  if (
    (activeUser?.role === 'PLAYER' || activeUser?.role === 'COACH') &&
    activeUser?.status === 'PENDING'
  ) {
    return (
      <Container maxWidth="md" sx={{ py: 12 }}>
        <Card
          sx={{
            borderTop: '4px solid #F4A300', // Gold accent
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}
        >
          <CardContent sx={{ p: 5, textAlign: 'center' }}>
            <Box sx={{ color: '#F4A300', mb: 3 }}>
              <HourglassEmptyIcon sx={{ fontSize: 72 }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Noto Serif', serif",
                fontWeight: 700,
                color: '#003366',
                mb: 2.5,
              }}
            >
              Profile Under Review / ప్రొఫైల్ పరిశీలనలో ఉంది
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#2C3E50',
                mb: 4,
                lineHeight: 1.8,
                maxWidth: '650px',
                mx: 'auto',
              }}
            >
              {t('dashboard.underReview')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                localStorage.removeItem('aptamp_token');
                localStorage.removeItem('aptamp_refresh_token');
                localStorage.removeItem('aptamp_user');
                window.location.href = '/login';
              }}
              sx={{ fontWeight: 600, px: 4 }}
            >
              Log Out / లాగౌట్
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return <Outlet />;
}
