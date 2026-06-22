import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, Skeleton, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';;
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import toast from 'react-hot-toast';

import PageTitle from '../../components/common/PageTitle';
import StatusBadge from '../../components/common/StatusBadge';
import { getPlayers, approvePlayer, rejectPlayer, getTournamentRegistrations, getContactMessages, getFeedbacks } from '../../api/admin.api';
import { getTournaments } from '../../api/tournament.api';

const COLORS = ['#003366', '#0057A8', '#F4A300', '#FF6600', '#27AE60'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch metrics data
  const { data: allPlayers = [], isLoading: loadPlayers } = useQuery({
    queryKey: ['adminAllPlayers'],
    queryFn: () => getPlayers(),
  });

  const { data: tournaments = [], isLoading: loadTournaments } = useQuery({
    queryKey: ['adminAllTournaments'],
    queryFn: () => getTournaments(),
  });

  const { data: registrations = [], isLoading: loadRegs } = useQuery({
    queryKey: ['adminAllRegistrations'],
    queryFn: () => getTournamentRegistrations(),
  });

  const { data: contacts = [], isLoading: loadContacts } = useQuery({
    queryKey: ['adminContactsDashboard'],
    queryFn: () => getContactMessages(),
  });

  const { data: feedbacks = [], isLoading: loadFeedbacks } = useQuery({
    queryKey: ['adminFeedbacksDashboard'],
    queryFn: () => getFeedbacks(),
  });

  const playersList = Array.isArray(allPlayers) ? allPlayers : [];
  const tournamentsList = Array.isArray(tournaments) ? tournaments : [];
  const regsList = Array.isArray(registrations) ? registrations : [];
  const contactsList = Array.isArray(contacts) ? contacts : [];
  const feedbacksList = Array.isArray(feedbacks) ? feedbacks : [];

  const pendingPlayers = playersList.filter((p) => p && p.status === 'PENDING');
  const activeTournaments = tournamentsList.filter((t) => t && t.status === 'PUBLISHED');

  const handleApprovePlayer = async (id) => {
    try {
      await approvePlayer(id);
      toast.success('Player approved / ఆటగాడు ఆమోదించబడ్డాడు');
      queryClient.invalidateQueries(['adminAllPlayers']);
    } catch (err) {
      toast.error('Action failed.');
    }
  };

  const handleRejectPlayer = async (id) => {
    try {
      await rejectPlayer(id);
      toast.success('Player profile rejected.');
      queryClient.invalidateQueries(['adminAllPlayers']);
    } catch (err) {
      toast.error('Action failed.');
    }
  };

  // Aggregate Chart Data 1: Registrations by District
  const districtCounts = playersList.reduce((acc, curr) => {
    const d = curr.district || 'Unassigned';
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.keys(districtCounts).map((key) => ({
    name: key,
    Players: districtCounts[key],
  })).slice(0, 8); // Top 8 districts

  // Aggregate Chart Data 2: Division Categories
  const categoryCounts = playersList.reduce((acc, curr) => {
    const c = curr.tennikoitCategory || 'SENIOR';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.keys(categoryCounts).map((key) => ({
    name: key,
    value: categoryCounts[key],
  }));

  const loading = loadPlayers || loadTournaments || loadRegs || loadContacts || loadFeedbacks;

  return (
    <Box>
      <PageTitle title="APTAMP Admin Analytics Dashboard" subtitle="Overview metrics, district athlete registrations, and tournament entries validation" />

      {loading ? (
        <Skeleton variant="rectangular" height={140} sx={{ mb: 4 }} />
      ) : (
        /* Top KPI row */
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: 'Total Players', value: playersList.length, color: '#003366' },
            { label: 'Pending Approvals', value: pendingPlayers.length, color: '#F4A300' },
            { label: 'Active Tournaments', value: activeTournaments.length, color: '#0057A8' },
            { label: 'Total Registrations', value: regsList.length, color: '#27AE60' },
            { label: 'Contact Queries', value: contactsList.length, color: '#9B59B6' },
            { label: 'Feedback Received', value: feedbacksList.length, color: '#E67E22' },
          ].map((kpi, idx) => (
            <Grid key={idx} item xs={12} sm={6} md={2}>
              <Card sx={{ borderTop: `4px solid ${kpi.color}`, bgcolor: '#ffffff' }}>
                <CardContent sx={{ py: 3, px: 1, textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#003366', mb: 0.5, fontFamily: 'monospace' }}>
                    {kpi.value}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    {kpi.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Row 2: Approvals and Registrations */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {/* Pending approvals */}
        <Grid  item xs={12} md={5}>
          <Typography variant="h6" sx={{ color: '#003366', fontWeight: 700, mb: 2 }}>
            Pending Player Approvals
          </Typography>
          {loading ? (
            <Skeleton variant="rectangular" height={250} />
          ) : pendingPlayers.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#F5F7FA' }}>
              <Typography variant="body2" color="text.secondary">No pending registrations under review.</Typography>
            </Card>
          ) : (
            <Stack spacing={1.5}>
              {pendingPlayers.slice(0, 4).map((p) => (
                <Card key={p.id} sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#003366' }}>
                        {p.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        District: {p.district} | Category: {p.tennikoitCategory}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <IconButton color="success" size="small" onClick={() => handleApprovePlayer(p.id)}>
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton color="error" size="small" onClick={() => handleRejectPlayer(p.id)}>
                        <CancelIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}
        </Grid>

        {/* Recent Registrations Table */}
        <Grid  item xs={12} md={7}>
          <Typography variant="h6" sx={{ color: '#003366', fontWeight: 700, mb: 2 }}>
            Recent Registrations (Last 10 entries)
          </Typography>
          {loading ? (
            <Skeleton variant="rectangular" height={250} />
          ) : regsList.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#F5F7FA' }}>
              <Typography variant="body2" color="text.secondary">No registrations recorded.</Typography>
            </Card>
          ) : (
            <TableContainer component={Paper} sx={{ border: '1px solid #D1D9E0' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#003366' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Athlete</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Tournament</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>District</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {regsList.slice(0, 10).map((r, i) => (
                    <TableRow key={r.id || i} sx={{ bgcolor: i % 2 === 0 ? '#FFFFFF' : '#F5F7FA' }}>
                      <TableCell sx={{ fontWeight: 600 }}>{r.player?.name}</TableCell>
                      <TableCell>{r.tournament?.title}</TableCell>
                      <TableCell>{r.player?.district}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>

      {/* Row 3: Charts */}
      {!loading && barChartData.length > 0 && (
        <Grid container spacing={4}>
          <Grid  item xs={12} md={7}>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#003366' }}>
                Player Registrations by District
              </Typography>
              <Box sx={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="Players" fill="#0057A8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
          <Grid  item xs={12} md={5}>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#003366' }}>
                Category Seeding Distribution
              </Typography>
              <Box sx={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
