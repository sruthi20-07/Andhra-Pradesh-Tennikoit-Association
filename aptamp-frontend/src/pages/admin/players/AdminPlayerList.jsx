import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, MenuItem, TextField, Stack, Button, Card, CardContent, Checkbox, FormControlLabel } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import toast from 'react-hot-toast';

import PageTitle from '../../../components/common/PageTitle';
import StatusBadge from '../../../components/common/StatusBadge';
import DataTable from '../../../components/common/DataTable';
import { getPlayers, approvePlayer, rejectPlayer, bulkApprovePlayers, bulkRejectPlayers } from '../../../api/admin.api';

const DISTRICTS = [
  'All Districts', 'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 
  'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'
];

export default function AdminPlayerList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [district, setDistrict] = useState('All Districts');
  const [status, setStatus] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState([]);

  const { data: players = [], isLoading } = useQuery({
    queryKey: ['adminPlayersList', district, status],
    queryFn: () => {
      const params = {};
      if (district !== 'All Districts') params.district = district;
      if (status !== 'ALL') params.status = status;
      return getPlayers(params);
    }
  });

  const handleApprove = async (id) => {
    try {
      await approvePlayer(id);
      toast.success('Player approved / ఆమోదించబడింది');
      queryClient.invalidateQueries(['adminPlayersList']);
    } catch (err) {
      toast.error('Action failed.');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectPlayer(id);
      toast.success('Player rejected.');
      queryClient.invalidateQueries(['adminPlayersList']);
    } catch (err) {
      toast.error('Action failed.');
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkApprovePlayers(selectedIds);
      toast.success(`Approved ${selectedIds.length} players successfully`);
      setSelectedIds([]);
      queryClient.invalidateQueries(['adminPlayersList']);
    } catch (e) {
      toast.error('Bulk approval failed.');
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkRejectPlayers(selectedIds);
      toast.success(`Rejected ${selectedIds.length} players`);
      setSelectedIds([]);
      queryClient.invalidateQueries(['adminPlayersList']);
    } catch (e) {
      toast.error('Bulk rejection failed.');
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(x => x !== id));
    }
  };

  const columns = [
    {
      field: 'select',
      headerName: 'Select',
      renderCell: ({ row }) => (
        <Checkbox
          checked={selectedIds.includes(row.id)}
          onChange={(e) => handleSelectRow(row.id, e.target.checked)}
          size="small"
        />
      ),
    },
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Full Name' },
    { field: 'district', headerName: 'District' },
    { field: 'tennikoitCategory', headerName: 'Category' },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }) => <StatusBadge status={row.status} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => navigate(`/admin/players/${row.id}`)}
          >
            View
          </Button>
          {row.status === 'PENDING' && (
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

  return (
    <Box>
      <PageTitle title="Player Directory Management / ఆటగాళ్ల మేనేజ్‌మెంట్" subtitle="Approve state athlete profiles, search district committees, and filter categories" />

      {/* District / Seeding Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' }, flexGrow: 1 }}>
              <TextField select label="District" value={district} onChange={(e) => setDistrict(e.target.value)} size="small" sx={{ minWidth: 150, bgcolor: '#ffffff' }}>
                {DISTRICTS.map((d) => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </TextField>
              <TextField select label="Approval Status" value={status} onChange={(e) => setStatus(e.target.value)} size="small" sx={{ minWidth: 150, bgcolor: '#ffffff' }}>
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </TextField>
            </Stack>

            {selectedIds.length > 0 && (
              <Stack direction="row" spacing={1.5}>
                <Button variant="contained" color="success" onClick={handleBulkApprove} sx={{ bgcolor: '#27AE60', fontWeight: 700 }}>
                  Bulk Approve ({selectedIds.length})
                </Button>
                <Button variant="contained" color="error" onClick={handleBulkReject} sx={{ bgcolor: '#C0392B', fontWeight: 700 }}>
                  Bulk Reject ({selectedIds.length})
                </Button>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        rows={players}
        loading={isLoading}
        searchPlaceholder="Search players by name or district..."
        exportFilename="players_report.csv"
      />
    </Box>
  );
}
