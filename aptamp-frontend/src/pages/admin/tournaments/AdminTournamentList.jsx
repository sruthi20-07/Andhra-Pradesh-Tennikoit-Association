import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Button, Stack, Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddIcon from '@mui/icons-material/Add';
import toast from 'react-hot-toast';

import PageTitle from '../../../components/common/PageTitle';
import StatusBadge from '../../../components/common/StatusBadge';
import DataTable from '../../../components/common/DataTable';
import { getTournaments } from '../../../api/tournament.api';
import { deleteTournament } from '../../../api/admin.api';

export default function AdminTournamentList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: tournaments = [], isLoading } = useQuery({
    queryKey: ['adminTournamentsList'],
    queryFn: () => getTournaments(),
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tournament?')) return;
    try {
      await deleteTournament(id);
      toast.success('Tournament deleted successfully');
      queryClient.invalidateQueries(['adminTournamentsList']);
    } catch (err) {
      toast.error('Deletion failed.');
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'title', headerName: 'Tournament Title' },
    { field: 'venue', headerName: 'Venue' },
    { field: 'startDate', headerName: 'Start Date' },
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
            startIcon={<AssignmentIcon />}
            onClick={() => navigate(`/admin/tournaments/${row.id}/registrations`)}
          >
            Registrations
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/admin/tournaments/${row.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <PageTitle title="Tournament Management / టోర్నమెంట్ల నిర్వహణ" subtitle="Publish selections, set registration deadlines, and allocate entry fees" />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/tournaments/create')}
          sx={{ height: 40, bgcolor: '#0057A8' }}
        >
          Create Tournament
        </Button>
      </Stack>

      <DataTable
        columns={columns}
        rows={tournaments}
        loading={isLoading}
        searchPlaceholder="Search by title or venue..."
        exportFilename="tournaments_report.csv"
      />
    </Box>
  );
}
