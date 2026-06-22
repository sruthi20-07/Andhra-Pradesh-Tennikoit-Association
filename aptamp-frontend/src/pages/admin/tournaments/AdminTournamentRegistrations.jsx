import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography, Button, Stack, MenuItem, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';

import PageTitle from '../../../components/common/PageTitle';
import StatusBadge from '../../../components/common/StatusBadge';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import DataTable from '../../../components/common/DataTable';
import { getTournamentById } from '../../../api/tournament.api';
import { getTournamentRegistrations, approveRegistration, rejectRegistration } from '../../../api/admin.api';

export default function AdminTournamentRegistrations() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('ALL');

  const { data: tournament, isLoading: loadTourn } = useQuery({
    queryKey: ['adminTournamentHeader', id],
    queryFn: () => getTournamentById(id),
  });

  const { data: registrations = [], isLoading: loadRegs } = useQuery({
    queryKey: ['adminRegistrationsList', id, status],
    queryFn: () => {
      const statusParam = status === 'ALL' ? '' : status;
      return getTournamentRegistrations(id, statusParam);
    }
  });

  const handleApprove = async (regId) => {
    try {
      await approveRegistration(regId);
      toast.success('Registration approved successfully');
      queryClient.invalidateQueries(['adminRegistrationsList', id, status]);
    } catch (e) {
      toast.error('Action failed.');
    }
  };

  const handleReject = async (regId) => {
    try {
      await rejectRegistration(regId);
      toast.success('Registration rejected successfully');
      queryClient.invalidateQueries(['adminRegistrationsList', id, status]);
    } catch (e) {
      toast.error('Action failed.');
    }
  };

  const columns = [
    { field: 'id', headerName: 'Reg ID' },
    { field: 'playerName', headerName: 'Player Name', renderCell: ({ row }) => row.player?.name || 'N/A' },
    { field: 'registrationNumber', headerName: 'Reg Num', renderCell: ({ row }) => row.player?.registrationNumber || 'N/A' },
    { field: 'district', headerName: 'District', renderCell: ({ row }) => row.player?.district || 'N/A' },
    { field: 'category', headerName: 'Category', renderCell: ({ row }) => row.category?.categoryName || 'N/A' },
    { field: 'paymentStatus', headerName: 'Payment Status', renderCell: ({ row }) => <StatusBadge status={row.paymentStatus} /> },
    { field: 'status', headerName: 'Status', renderCell: ({ row }) => <StatusBadge status={row.status} /> },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          {(row.status === 'PENDING' || row.status === 'REGISTERED') && (
            <>
              <Button
                variant="contained"
                size="small"
                color="success"
                startIcon={<CheckIcon />}
                onClick={() => handleApprove(row.id)}
                sx={{ bgcolor: '#27AE60', '&:hover': { bgcolor: '#1e7e43' } }}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                size="small"
                color="error"
                startIcon={<CloseIcon />}
                onClick={() => handleReject(row.id)}
                sx={{ bgcolor: '#C0392B', '&:hover': { bgcolor: '#8e281e' } }}
              >
                Reject
              </Button>
            </>
          )}
        </Stack>
      ),
    },
  ];

  if (loadTourn) return <LoadingSpinner message="Loading Registrations Portal..." />;

  return (
    <Box>
      <Button variant="outlined" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }} onClick={() => navigate('/admin/tournaments')}>
        Back to Tournaments
      </Button>

      <PageTitle title={`Registrations — ${tournament.title}`} subtitle={`Venue: ${tournament.venue} | Entry Fee: ₹${tournament.entryFee}`} />

      {/* Filter */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 2 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              select
              label="Registration Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              size="small"
              sx={{ minWidth: 200, bgcolor: '#ffffff' }}
            >
              <MenuItem value="ALL">All Registrations</MenuItem>
              <MenuItem value="CONFIRMED">Approved</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        rows={registrations}
        loading={loadRegs}
        searchPlaceholder="Search registrations..."
        exportFilename={`registrations_tournament_${id}.csv`}
      />
    </Box>
  );
}
