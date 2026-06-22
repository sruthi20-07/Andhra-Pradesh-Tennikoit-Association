import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography, Button, Stack, MenuItem, TextField } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';

import PageTitle from '../../../components/common/PageTitle';
import StatusBadge from '../../../components/common/StatusBadge';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import DataTable from '../../../components/common/DataTable';
import { getTournamentRegistrations, updateRegistrationPaymentStatus } from '../../../api/admin.api';

export default function OfflineRegistrationsManager() {
  const queryClient = useQueryClient();
  const [filterPayment, setFilterPayment] = useState('ALL');

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ['adminAllRegistrationsList', filterPayment],
    queryFn: async () => {
      // Fetch all registrations (passing null for tournamentId)
      const data = await getTournamentRegistrations(null);
      if (filterPayment === 'ALL') return data;
      return data.filter(r => r.paymentStatus === filterPayment);
    }
  });

  const handleMarkPaid = async (regId) => {
    try {
      await updateRegistrationPaymentStatus(regId, 'PAID');
      toast.success('Registration marked as PAID and CONFIRMED');
      queryClient.invalidateQueries(['adminAllRegistrationsList']);
    } catch (e) {
      toast.error('Action failed.');
    }
  };

  const handleMarkPending = async (regId) => {
    try {
      await updateRegistrationPaymentStatus(regId, 'PENDING_PAYMENT');
      toast.success('Registration marked as PENDING');
      queryClient.invalidateQueries(['adminAllRegistrationsList']);
    } catch (e) {
      toast.error('Action failed.');
    }
  };

  const handleReject = async (regId) => {
    try {
      await updateRegistrationPaymentStatus(regId, 'REJECTED');
      toast.success('Registration REJECTED');
      queryClient.invalidateQueries(['adminAllRegistrationsList']);
    } catch (e) {
      toast.error('Action failed.');
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'playerName', headerName: 'Player Name', renderCell: ({ row }) => row.player?.name || 'N/A' },
    { field: 'registrationNumber', headerName: 'Registration Number', renderCell: ({ row }) => row.player?.registrationNumber || 'N/A' },
    { field: 'tournament', headerName: 'Tournament', renderCell: ({ row }) => row.tournament?.title || 'N/A' },
    { field: 'category', headerName: 'Category', renderCell: ({ row }) => row.category?.categoryName || 'N/A' },
    { 
      field: 'registrationDate', 
      headerName: 'Registration Date', 
      renderCell: ({ row }) => {
        if (!row.registrationDate) return '';
        try {
          return new Date(row.registrationDate).toLocaleDateString();
        } catch (e) {
          return '';
        }
      } 
    },
    { field: 'paymentStatus', headerName: 'Payment Status', renderCell: ({ row }) => <StatusBadge status={row.paymentStatus} /> },
    { field: 'registrationStatus', headerName: 'Registration Status', renderCell: ({ row }) => <StatusBadge status={row.registrationStatus || row.status} /> },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 350,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            size="small"
            color="success"
            startIcon={<CheckIcon />}
            onClick={() => handleMarkPaid(row.id)}
            sx={{ bgcolor: '#27AE60', '&:hover': { bgcolor: '#1e7e43' }, textTransform: 'none' }}
          >
            Mark Paid
          </Button>
          <Button
            variant="contained"
            size="small"
            color="warning"
            startIcon={<PendingIcon />}
            onClick={() => handleMarkPending(row.id)}
            sx={{ bgcolor: '#F39C12', '&:hover': { bgcolor: '#d6850f' }, textTransform: 'none' }}
          >
            Mark Pending
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            startIcon={<CloseIcon />}
            onClick={() => handleReject(row.id)}
            sx={{ bgcolor: '#C0392B', '&:hover': { bgcolor: '#8e281e' }, textTransform: 'none' }}
          >
            Reject
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <PageTitle title="Tournament Registrations" subtitle="Manage player tournament registrations and offline payment status" />

      {/* Filter */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 2 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              select
              label="Filter by Payment Status"
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              size="small"
              sx={{ minWidth: 250, bgcolor: '#ffffff' }}
            >
              <MenuItem value="ALL">All Payment Statuses</MenuItem>
              <MenuItem value="PENDING_PAYMENT">Pending Payment</MenuItem>
              <MenuItem value="PAID">Paid</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        rows={registrations}
        loading={isLoading}
        searchPlaceholder="Search registrations..."
        exportFilename="offline_tournament_registrations.csv"
      />
    </Box>
  );
}
