import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography, Button, TextField, MenuItem, Stack, Box, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid';;
import PageTitle from '../../components/common/PageTitle';
import StatusBadge from '../../components/common/StatusBadge';
import { getTournaments } from '../../api/tournament.api';

export default function TournamentsPublicPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('PUBLISHED');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: tournamentsRaw = [], isLoading } = useQuery({
    queryKey: ['publicTournaments', statusFilter],
    queryFn: () => getTournaments({ status: statusFilter }),
  });

  const tournaments = Array.isArray(tournamentsRaw) ? tournamentsRaw : (tournamentsRaw?.content || tournamentsRaw?.data || []);

  const filteredTournaments = tournaments.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <PageTitle title="Championships & Selection Trials / టోర్నమెంట్లు" subtitle="List of all state tennikoit leagues, selections, and referee clinics" />

      {/* Filter and Search Bar */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <TextField
          label="Search by title or venue"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, bgcolor: '#ffffff' }}
        />
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 150, bgcolor: '#ffffff' }}
        >
          <MenuItem value="PUBLISHED">Published</MenuItem>
          <MenuItem value="DRAFT">Draft</MenuItem>
          <MenuItem value="CANCELLED">Cancelled</MenuItem>
        </TextField>
      </Stack>

      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((n) => (
            <Grid key={n} item xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" height={220} />
            </Grid>
          ))}
        </Grid>
      ) : filteredTournaments.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center', bgcolor: '#F5F7FA' }}>
          <Typography variant="body1" color="text.secondary">
            No tournaments found matching the filters.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredTournaments.map((t) => (
            <Grid key={t.id} item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderLeft: '5px solid #0057A8' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ color: '#003366', fontWeight: 700, mb: 1.5 }}>
                    {t.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Venue:</strong> {t.venue}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Start Date:</strong> {t.startDate}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Registration Deadline:</strong> {t.registrationDeadline ? new Date(t.registrationDeadline).toLocaleDateString() : 'N/A'}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <StatusBadge status={t.status} />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/tournaments/${t.id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
