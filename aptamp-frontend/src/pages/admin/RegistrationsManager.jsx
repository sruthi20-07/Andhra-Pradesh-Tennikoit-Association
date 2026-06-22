import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Typography, Box, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip, TextField, MenuItem, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';;
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import tournamentService from '../../services/tournamentService';
import Loader from '../../components/common/Loader';
import { getStatusColor, formatCurrency } from '../../utils/formatters';

export default function RegistrationsManager() {
  const queryClient = useQueryClient();
  const [tournamentId, setTournamentId] = useState('');
  const [status, setStatus] = useState('');

  // Fetch registrations query
  const { data: registrations, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminRegistrations', { tournamentId, status }],
    queryFn: () => tournamentService.getRegistrations({ tournamentId, status })
  });

  // Action status update mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => tournamentService.updateRegistrationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRegistrations'] });
      alert('Registration status updated successfully.');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to update registration.');
    }
  });

  if (isLoading) {
    return <Loader message="Loading registrations ledger..." />;
  }

  const list = registrations || [];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Manage Tournament Brackets Registrations
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid  item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Tournament ID"
                size="small"
                value={tournamentId}
                onChange={(e) => setTournamentId(e.target.value)}
              />
            </Grid>
            <Grid  item xs={12} sm={5}>
              <TextField
                fullWidth
                select
                label="Filter by Status"
                size="small"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
                <MenuItem value="PENDING_PAYMENT">Pending Payment</MenuItem>
              </TextField>
            </Grid>
            <Grid  item xs={12} sm={2}>
              <Button variant="contained" fullWidth onClick={() => refetch()} sx={{ height: '100%' }}>
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading tournament registrations.
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Registration ID</TableCell>
              <TableCell>Player Name</TableCell>
              <TableCell>Tournament</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No tournament registrations found matching filters.
                </TableCell>
              </TableRow>
            ) : (
              list.map((reg) => (
                <TableRow key={reg.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{reg.id}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{reg.player?.name}</TableCell>
                  <TableCell>{reg.tournament?.name}</TableCell>
                  <TableCell>{reg.category?.name || 'Singles'}</TableCell>
                  <TableCell>
                    <Chip label={reg.status} color={getStatusColor(reg.status)} size="small" sx={{ fontWeight: 600 }} />
                  </TableCell>
                  <TableCell align="right">
                    {reg.status === 'PENDING' && (
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => updateStatusMutation.mutate({ id: reg.id, status: 'APPROVED' })}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={<CancelIcon />}
                          onClick={() => updateStatusMutation.mutate({ id: reg.id, status: 'REJECTED' })}
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
