import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Container, Card, CardContent, Typography, Button, Stack, Divider, Box, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';;
import PageTitle from '../../components/common/PageTitle';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getTournamentById } from '../../api/tournament.api';

export default function TournamentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: tournament, isLoading, error } = useQuery({
    queryKey: ['tournamentDetail', id],
    queryFn: () => getTournamentById(id),
  });

  if (isLoading) return <LoadingSpinner message="Fetching details..." />;
  if (error || !tournament) {
    return (
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h5" color="error">Tournament not found</Typography>
        <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/tournaments')}>Back to Tournaments</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Button variant="outlined" sx={{ mb: 3 }} onClick={() => navigate('/tournaments')}>&larr; Back</Button>
      <PageTitle title={tournament.title} subtitle={`Hosted by: ${tournament.organizer || 'APTA Office'}`} />

      <Grid container spacing={4}>
        <Grid  item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ color: '#003366', fontWeight: 700, mb: 2, fontFamily: "'Noto Serif', serif" }}>
                Tournament Description
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {tournament.description || 'No detailed description provided for this championship.'}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ color: '#003366', fontWeight: 700, mb: 2, fontFamily: "'Noto Serif', serif" }}>
                Categories Offered
              </Typography>
              <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }} useFlexGap>
                {tournament.categories && tournament.categories.length > 0 ? (
                  tournament.categories.map((cat) => (
                    <Chip
                      key={cat.id}
                      label={`${cat.categoryName} (${cat.gender}) — Ages: ${cat.minAge || 0}-${cat.maxAge || 'Open'}`}
                      sx={{ borderRadius: '4px', p: 1, fontWeight: 600, bgcolor: 'rgba(0, 87, 168, 0.08)' }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No categories mapped to this selection trial.</Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid  item xs={12} md={4}>
          <Card sx={{ borderTop: '4px solid #F4A300', mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#003366' }}>
                Event Logistical Details
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Venue</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{tournament.venue}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Start Date</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{tournament.startDate}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">End Date</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{tournament.endDate}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Registration Deadline</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {tournament.registrationDeadline ? new Date(tournament.registrationDeadline).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Entry Fee</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#27AE60' }}>
                    {tournament.entryFee > 0 ? `₹${tournament.entryFee}` : 'Free Entry'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Current Status</Typography>
                  <StatusBadge status={tournament.status} />
                </Box>
              </Stack>
              <Divider sx={{ my: 3 }} />
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/player/dashboard')}
                disabled={tournament.status !== 'PUBLISHED'}
                sx={{
                  bgcolor: '#FF6600',
                  '&:hover': { bgcolor: '#d95300' },
                  fontWeight: 700,
                  py: 1.5
                }}
              >
                Register via Dashboard
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
