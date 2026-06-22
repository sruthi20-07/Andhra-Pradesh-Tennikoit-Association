import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Typography, Box, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';;
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import Loader from '../../components/common/Loader';
import grievanceService from '../../services/grievanceService';
import { formatDate } from '../../utils/formatters';

export default function GrievanceManager() {
  const queryClient = useQueryClient();
  const [resolveItem, setResolveItem] = useState(null);
  const [resolutionText, setResolutionText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const { data: grievances, isLoading } = useQuery({
    queryKey: ['adminGrievances'],
    queryFn: grievanceService.getGrievances
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, details }) => grievanceService.resolveGrievance(id, details),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGrievances'] });
      setResolveItem(null);
      setResolutionText('');
      alert('Grievance resolved successfully.');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to resolve grievance.');
    }
  });

  if (isLoading) {
    return <Loader message="Loading grievance entries..." />;
  }

  const handleResolveOpen = (item) => {
    setResolveItem(item);
    setResolutionText(item.resolutionDetails || '');
  };

  const handleConfirmResolve = () => {
    if (!resolutionText.trim()) {
      alert('Please enter resolution details.');
      return;
    }
    resolveMutation.mutate({
      id: resolveItem.id,
      details: resolutionText
    });
  };

  const list = grievances || [];

  const filtered = list.filter((g) => {
    const matchesStatus = statusFilter === 'ALL' || g.status === statusFilter;
    const matchesSearch =
      g.subject.toLowerCase().includes(search.toLowerCase()) ||
      (g.name && g.name.toLowerCase().includes(search.toLowerCase())) ||
      (g.email && g.email.toLowerCase().includes(search.toLowerCase())) ||
      `#aptamp-${g.id}`.includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, color: 'primary.dark' }}>
        Manage Grievances
      </Typography>

      <Card sx={{ mb: 4, p: 2, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid  item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by ticket ID, subject, or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                }
              }}
            />
          </Grid>
          <Grid  item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              size="small"
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="ALL">All Grievances</MenuItem>
              <MenuItem value="OPEN">Open</MenuItem>
              <MenuItem value="RESOLVED">Resolved</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Card>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Ticket ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Submitter</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Subject</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Date Filed</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((g) => (
              <TableRow key={g.id} hover>
                <TableCell>#APTAMP-{g.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{g.name || 'User'}</Typography>
                  <Typography variant="caption" color="text.secondary">{g.email}</Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{g.subject}</TableCell>
                <TableCell>{formatDate(g.createdAt)}</TableCell>
                <TableCell>
                  <Chip
                    label={g.status}
                    color={g.status === 'RESOLVED' ? 'success' : 'warning'}
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant={g.status === 'RESOLVED' ? 'outlined' : 'contained'}
                    color={g.status === 'RESOLVED' ? 'primary' : 'error'}
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleResolveOpen(g)}
                    sx={{ borderRadius: 2 }}
                  >
                    {g.status === 'RESOLVED' ? 'View Details' : 'Resolve Ticket'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Resolve Grievance Dialog */}
      <Dialog open={Boolean(resolveItem)} onClose={() => setResolveItem(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>
          {resolveItem?.status === 'RESOLVED' ? 'Grievance Record' : 'Resolve Grievance'}
        </DialogTitle>
        <DialogContent dividers>
          {resolveItem && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Submitted by: {resolveItem.name} ({resolveItem.email})
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, mt: 1, mb: 1 }}>
                Subject: {resolveItem.subject}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, whiteSpace: 'pre-line', p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                {resolveItem.description}
              </Typography>

              {resolveItem.status === 'RESOLVED' ? (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                    Resolution Details:
                  </Typography>
                  <Typography variant="body2" sx={{ p: 2, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0' }}>
                    {resolveItem.resolutionDetails}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    Resolved By: {resolveItem.resolvedByName} on {formatDate(resolveItem.resolvedAt)}
                  </Typography>
                </Box>
              ) : (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Resolution Action / తీర్మానం"
                  placeholder="Enter details of action taken to resolve this complaint..."
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResolveItem(null)}>Cancel</Button>
          {resolveItem?.status !== 'RESOLVED' && (
            <Button
              onClick={handleConfirmResolve}
              variant="contained"
              color="success"
              disabled={resolveMutation.isPending}
            >
              Resolve Ticket
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
