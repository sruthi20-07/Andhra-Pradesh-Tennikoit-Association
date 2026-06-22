import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography, TextField, Button, MenuItem, Stack, Box, Chip, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid';;
import PageTitle from '../../components/common/PageTitle';
import StatusBadge from '../../components/common/StatusBadge';
import { getTournaments, getMyRegistrations } from '../../api/tournament.api';

export default function PlayerTournaments() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');

  const { data: tournamentsRaw = [], isLoading: loadTournaments } = useQuery({
    queryKey: ['playerTournaments'],
    queryFn: () => getTournaments({ status: 'PUBLISHED' }),
  });

  const { data: registrationsRaw = [], isLoading: loadRegs } = useQuery({
    queryKey: ['playerMyRegistrationsForMatch'],
    queryFn: () => getMyRegistrations(),
  });

  const tournaments = Array.isArray(tournamentsRaw) ? tournamentsRaw : (tournamentsRaw?.content || tournamentsRaw?.data || []);
  const registrations = Array.isArray(registrationsRaw) ? registrationsRaw : (registrationsRaw?.content || registrationsRaw?.data || []);

  const filteredTournaments = tournaments.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.venue.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (catFilter === 'ALL') return matchesSearch;
    return matchesSearch && t.categories?.some(cat => cat.categoryName.toUpperCase() === catFilter);
  });

  const getRegistrationStatus = (tournamentId) => {
    const reg = registrations.find(r => r.tournament?.id === tournamentId);
    if (reg) {
      return { registered: true, status: reg.status, id: reg.id };
    }
    return { registered: false };
  };

  return (
    <Box>
      <PageTitle title="Open Championships / పోటీల నమోదు" subtitle="Register for upcoming district trials and tennikoit brackets" />

      {/* Filter Bar */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <TextField
          label="Search by title or venue"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, bgcolor: '#ffffff' }}
        />
        <TextField
          select
          label="Age Division"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 150, bgcolor: '#ffffff' }}
        >
          <MenuItem value="ALL">All Categories</MenuItem>
          <MenuItem value="MEN">Men's Singles</MenuItem>
          <MenuItem value="WOMEN">Women's Singles</MenuItem>
          <MenuItem value="JUNIOR">Junior Boys</MenuItem>
          <MenuItem value="SUB_JUNIOR">Sub-Junior Boys</MenuItem>
        </TextField>
      </Stack>

      {loadTournaments || loadRegs ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((n) => (
            <Grid key={n} item xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" height={220} />
            </Grid>
          ))}
        </Grid>
      ) : filteredTournaments.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center', bgcolor: '#F5F7FA' }}>
          <Typography variant="body1" color="text.secondary">No championships currently open for registration.</Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredTournaments.map((t) => {
            const regInfo = getRegistrationStatus(t.id);
            const isClosed = t.status === 'CLOSED' || t.status === 'CANCELLED';

            return (
              <Grid key={t.id} item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderLeft: '5px solid #0057A8' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ color: '#003366', fontWeight: 700, mb: 1 }}>
                      {t.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.85rem' }}>
                      <strong>Venue:</strong> {t.venue}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.85rem' }}>
                      <strong>Start Date:</strong> {t.startDate}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, fontSize: '0.85rem' }}>
                      <strong>Fee:</strong> {t.entryFee > 0 ? `₹${t.entryFee}` : 'Free'}
                    </Typography>
                    <Stack direction="row" spacing={0.8} sx={{ flexWrap: 'wrap' }} useFlexGap>
                      {t.categories?.map((c) => (
                        <Chip key={c.id} label={`${c.categoryName}`} size="small" variant="outlined" sx={{ borderRadius: '4px', fontSize: '0.72rem' }} />
                      ))}
                    </Stack>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <StatusBadge status={t.status} />
                    
                    {regInfo.registered ? (
                      <Chip label={`Registered (${regInfo.status})`} color="success" size="small" sx={{ borderRadius: '4px', fontWeight: 700 }} />
                    ) : isClosed ? (
                      <Chip label="Closed" color="default" size="small" sx={{ borderRadius: '4px', fontWeight: 700 }} />
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/player/tournaments/${t.id}`)}
                      >
                        Register
                      </Button>
                    )}
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
