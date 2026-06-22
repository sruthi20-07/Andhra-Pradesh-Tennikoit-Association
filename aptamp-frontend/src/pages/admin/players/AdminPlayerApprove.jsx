import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography, Button, List, ListItem, ListItemText, Stack, Skeleton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import toast from 'react-hot-toast';

import PageTitle from '../../../components/common/PageTitle';
import { getPlayers, approvePlayer, rejectPlayer } from '../../../api/admin.api';

export default function AdminPlayerApprove() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: players = [], isLoading } = useQuery({
    queryKey: ['adminPendingApprovalsOnly'],
    queryFn: () => getPlayers({ status: 'PENDING' }),
  });

  const handleApprove = async (id) => {
    try {
      await approvePlayer(id);
      toast.success('Player approved');
      queryClient.invalidateQueries(['adminPendingApprovalsOnly']);
    } catch (e) {
      toast.error('Action failed.');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectPlayer(id);
      toast.success('Player rejected');
      queryClient.invalidateQueries(['adminPendingApprovalsOnly']);
    } catch (e) {
      toast.error('Action failed.');
    }
  };

  return (
    <Box>
      <Button variant="outlined" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }} onClick={() => navigate('/admin/players')}>
        Back
      </Button>

      <PageTitle title="Action Required: Player Reviews" subtitle="Review registrations awaiting verification from the sports director" />

      {isLoading ? (
        <Skeleton variant="rectangular" height={300} />
      ) : players.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#F5F7FA' }}>
          <Typography variant="body1" color="text.secondary">All player profiles have been validated.</Typography>
        </Card>
      ) : (
        <List sx={{ p: 0 }}>
          {players.map((p) => (
            <Card key={p.id} sx={{ mb: 2, borderLeft: '4px solid #F4A300' }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#003366' }}>{p.name}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">District: {p.district} | Category: {p.tennikoitCategory}</Typography>
                  </Box>
                  <Stack direction="row" spacing={1.5}>
                    <Button variant="contained" color="success" size="small" startIcon={<CheckIcon />} onClick={() => handleApprove(p.id)} sx={{ bgcolor: '#27AE60' }}>
                      Approve
                    </Button>
                    <Button variant="contained" color="error" size="small" startIcon={<CloseIcon />} onClick={() => handleReject(p.id)} sx={{ bgcolor: '#C0392B' }}>
                      Reject
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </List>
      )}
    </Box>
  );
}
