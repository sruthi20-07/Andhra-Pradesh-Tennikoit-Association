import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Typography, Button, Stack, IconButton, Tooltip, Skeleton,  } from '@mui/material';
import Grid from '@mui/material/Grid';;
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import NotificationsIcon from '@mui/icons-material/Notifications';
import toast from 'react-hot-toast';

import PageTitle from '../../components/common/PageTitle';
import { getProfile } from '../../api/player.api';
import { getTournaments } from '../../api/tournament.api';
import { getNotifications } from '../../api/notification.api';

export default function PlayerDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Fetch full details
  const { data: profile, isLoading: loadProfile } = useQuery({
    queryKey: ['playerDashboardProfile'],
    queryFn: getProfile,
  });

  const { data: tournamentsRaw = [], isLoading: loadTournaments } = useQuery({
    queryKey: ['playerDashboardTournaments'],
    queryFn: () => getTournaments({ status: 'PUBLISHED' }),
  });

  const { data: notificationsRaw = [], isLoading: loadNotifications } = useQuery({
    queryKey: ['playerDashboardNotifications'],
    queryFn: getNotifications,
  });

  const tournaments = Array.isArray(tournamentsRaw) ? tournamentsRaw : (tournamentsRaw?.content || tournamentsRaw?.data || []);
  const notifications = Array.isArray(notificationsRaw) ? notificationsRaw : (notificationsRaw?.content || notificationsRaw?.data || []);

  const handleCopyId = () => {
    const idStr = `APTAMP-${profile?.id || user?.id}`;
    navigator.clipboard.writeText(idStr);
    toast.success('Player ID copied to clipboard!');
  };

  return (
    <Box>
      {/* Welcome Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #003366 0%, #0057A8 100%)',
          color: '#ffffff',
          p: 4,
          borderRadius: '4px',
          mb: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, fontFamily: "'Noto Serif', serif" }}>
          {t('dashboard.welcome', { name: profile?.name || user?.name })}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>
          స్వాగతం, {profile?.name || user?.name}! Manage your match registrations, check district seeding, and download circulars.
        </Typography>
      </Box>

      {/* Row 1 — Info Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid  item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderLeft: '4px solid #F4A300' }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600 }}>
                {t('dashboard.playerId')}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                  APTAMP-{profile?.id || user?.id}
                </Typography>
                <Tooltip title="Copy ID">
                  <IconButton size="small" onClick={handleCopyId} sx={{ color: '#0057A8' }}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid  item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderLeft: '4px solid #0057A8' }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600 }}>
                {t('dashboard.district')}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, color: '#003366' }}>
                {profile?.district || user?.district || 'Not Selected'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid  item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderLeft: '4px solid #0057A8' }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600 }}>
                {t('dashboard.category')}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, color: '#003366' }}>
                {profile?.tennikoitCategory || 'SENIOR'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid  item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderLeft: '4px solid #27AE60' }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600 }}>
                {t('dashboard.currentRank')}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, color: '#27AE60' }}>
                {profile?.rank ? `#${profile.rank}` : 'Unranked'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Grid content */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {/* Recent Tournaments */}
        <Grid  item xs={12} md={6}>
          <PageTitle title={t('dashboard.recentTournaments')} />
          {loadTournaments ? (
            <Skeleton variant="rectangular" height={200} />
          ) : tournaments.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#F5F7FA' }}>
              <Typography variant="body2" color="text.secondary">No tournaments open for registration.</Typography>
            </Card>
          ) : (
            <Stack spacing={2}>
              {tournaments.slice(0, 3).map((t) => (
                <Card key={t.id} sx={{ display: 'flex', justifyContent: 'space-between', p: 2, alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#003366' }}>
                      {t.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Venue: {t.venue} | Date: {t.startDate}
                    </Typography>
                  </Box>
                  <Button variant="contained" size="small" onClick={() => navigate(`/player/tournaments`)}>
                    Register
                  </Button>
                </Card>
              ))}
            </Stack>
          )}
        </Grid>

        {/* Recent Notifications */}
        <Grid  item xs={12} md={6}>
          <PageTitle title={t('dashboard.recentNotifications')} />
          {loadNotifications ? (
            <Skeleton variant="rectangular" height={200} />
          ) : notifications.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#F5F7FA' }}>
              <Typography variant="body2" color="text.secondary">{t('dashboard.noNotifications')}</Typography>
            </Card>
          ) : (
            <Stack spacing={2}>
              {notifications.slice(0, 3).map((n) => (
                <Card key={n.id} sx={{ p: 2, borderLeft: n.isRead ? '3px solid #cbd5e1' : '3px solid #FF6600' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#003366', display: 'flex', alignItems: 'center', gap: 1 }}>
                    {!n.isRead && <StarIcon sx={{ color: '#F4A300', fontSize: 16 }} />}
                    {n.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                    {n.message}
                  </Typography>
                </Card>
              ))}
            </Stack>
          )}
        </Grid>
      </Grid>

      {/* Row 4 — Quick Actions */}
      <Card sx={{ borderTop: '3px solid #F4A300', mt: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#003366', mb: 2 }}>
            {t('dashboard.quickActions')}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate('/player/tournaments')}
              sx={{ bgcolor: '#0057A8', fontWeight: 700 }}
            >
              {t('dashboard.registerTournament')}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/player/rankings')}
              sx={{ color: '#0057A8', borderColor: '#0057A8', fontWeight: 700 }}
            >
              {t('dashboard.viewRankings')}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/player/profile/edit')}
              sx={{ color: '#0057A8', borderColor: '#0057A8', fontWeight: 700 }}
            >
              {t('dashboard.updateProfile')}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
