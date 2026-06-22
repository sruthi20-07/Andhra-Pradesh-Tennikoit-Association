import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Box, Card, CardContent, Typography, Button, Stack, Divider, MenuItem, TextField, CircularProgress,  } from '@mui/material';
import Grid from '@mui/material/Grid';;

import PageTitle from '../../components/common/PageTitle';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getTournamentById, registerForTournament } from '../../api/tournament.api';

export default function PlayerTournamentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCatId, setSelectedCatId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: tournament, isLoading } = useQuery({
    queryKey: ['playerTournamentDetail', id],
    queryFn: () => getTournamentById(id),
  });

  const handleRegister = async () => {
    if (!selectedCatId) {
      toast.error('Please select a category first.');
      return;
    }

    setSubmitting(true);
    try {
      await registerForTournament(tournament.id, selectedCatId);
      toast.success('Tournament registration successful');
      queryClient.invalidateQueries(['playerMyRegistrationsForMatch']);
      navigate('/player/my-registrations');
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. You might already be registered.';
      toast.error(msg);
      setSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner message="Fetching Tournament Info..." />;

  return (
    <Box>
      <Button variant="outlined" sx={{ mb: 3 }} onClick={() => navigate('/player/tournaments')}>
        &larr; Back to Tournaments
      </Button>

      <PageTitle title={tournament.title} subtitle={`Venue: ${tournament.venue}`} />

      <Grid container spacing={4}>
        <Grid  item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ color: '#003366', fontWeight: 700, mb: 2 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                {tournament.description || 'No description available.'}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderTop: '3.5px solid #F4A300' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ color: '#003366', fontWeight: 700, mb: 3 }}>
                Enroll for Championship Category
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  select
                  fullWidth
                  label="Choose Category / విభాగం"
                  value={selectedCatId}
                  onChange={(e) => setSelectedCatId(e.target.value)}
                  size="small"
                  sx={{ bgcolor: '#ffffff', maxWidth: 350 }}
                >
                  {tournament.categories?.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.categoryName} ({cat.gender})
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="contained"
                  disabled={submitting}
                  onClick={handleRegister}
                  sx={{ bgcolor: '#FF6600', '&:hover': { bgcolor: '#d95300' }, py: 1, px: 3, fontWeight: 700 }}
                >
                  {submitting ? <CircularProgress size={20} color="inherit" /> : 'Confirm Register'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid  item xs={12} md={4}>
          <Card sx={{ borderTop: '3.5px solid #0057A8' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#003366', mb: 2 }}>
                Logistics & Timeline
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Organizer</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{tournament.organizer || 'APTA Office'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Duration</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{tournament.startDate} to {tournament.endDate}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Enrollment Deadline</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {tournament.registrationDeadline ? new Date(tournament.registrationDeadline).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Fee (INR)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#27AE60' }}>
                    {tournament.entryFee > 0 ? `₹${tournament.entryFee}` : 'Free'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Event Status</Typography>
                  <StatusBadge status={tournament.status} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
