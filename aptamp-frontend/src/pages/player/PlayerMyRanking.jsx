import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Box, Card, CardContent, Typography, Stack, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';;
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarRateIcon from '@mui/icons-material/StarRate';
import PageTitle from '../../components/common/PageTitle';
import { getMyRanking } from '../../api/ranking.api';
import { getProfile } from '../../api/player.api';

export default function PlayerMyRanking() {
  const { user } = useSelector((state) => state.auth);

  // Fetch player details first to get the correct player ID
  const { data: profile, isLoading: loadProfile } = useQuery({
    queryKey: ['myRankingProfile'],
    queryFn: getProfile,
  });

  const playerId = profile?.id || user?.id;

  const { data: ranking, isLoading: loadRanking } = useQuery({
    queryKey: ['myPersonalRanking', playerId],
    queryFn: () => getMyRanking(playerId),
    enabled: !!playerId,
  });

  if (loadProfile || loadRanking) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const rankStr = ranking?.rank || 'Unranked';
  const pointsVal = ranking?.points || 0;

  return (
    <Box>
      <PageTitle title="My Seeding Scorecard / నా ర్యాంకింగ్స్" subtitle="Your official state tennikoit ranking and match point totals" />

      <Grid container spacing={4}>
        <Grid  item xs={12} md={6}>
          <Card sx={{ borderTop: '4px solid #F4A300', bgcolor: '#ffffff', textAlign: 'center', py: 4 }}>
            <CardContent>
              <Box sx={{ display: 'inline-flex', bgcolor: 'rgba(244, 163, 0, 0.1)', color: '#F4A300', p: 3, borderRadius: '50%', mb: 2 }}>
                <EmojiEventsIcon sx={{ fontSize: 50 }} />
              </Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Current State Ranking
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#003366', mb: 1, fontFamily: 'monospace' }}>
                {rankStr === 'Unranked' ? 'Unranked' : `#${rankStr}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calculated across the senior state division
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid  item xs={12} md={6}>
          <Card sx={{ borderTop: '4px solid #0057A8', bgcolor: '#ffffff', textAlign: 'center', py: 4 }}>
            <CardContent>
              <Box sx={{ display: 'inline-flex', bgcolor: 'rgba(0, 87, 168, 0.1)', color: '#0057A8', p: 3, borderRadius: '50%', mb: 2 }}>
                <StarRateIcon sx={{ fontSize: 50 }} />
              </Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Points Seeding
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#003366', mb: 1, fontFamily: 'monospace' }}>
                {pointsVal} PTS
              </Typography>
              <Typography variant="body2" color="text.secondary">
                100 points awarded per completed tournament match win
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
