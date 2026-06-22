import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography, Button, Divider, Stack, Avatar } from '@mui/material';
import Grid from '@mui/material/Grid';;
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import toast from 'react-hot-toast';

import PageTitle from '../../../components/common/PageTitle';
import StatusBadge from '../../../components/common/StatusBadge';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { getPlayerById } from '../../../api/player.api';
import { approvePlayer, rejectPlayer } from '../../../api/admin.api';

export default function AdminPlayerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: player, isLoading } = useQuery({
    queryKey: ['adminPlayerDetail', id],
    queryFn: () => getPlayerById(id),
  });

  const handleApprove = async () => {
    try {
      await approvePlayer(id);
      toast.success('Player approved / ఆమోదించబడింది');
      queryClient.invalidateQueries(['adminPlayerDetail', id]);
      navigate('/admin/players');
    } catch (err) {
      toast.error('Action failed.');
    }
  };

  const handleReject = async () => {
    try {
      await rejectPlayer(id);
      toast.success('Player profile rejected.');
      queryClient.invalidateQueries(['adminPlayerDetail', id]);
      navigate('/admin/players');
    } catch (err) {
      toast.error('Action failed.');
    }
  };

  if (isLoading) return <LoadingSpinner message="Fetching Profile Details..." />;

  const infoRows = [
    { label: 'Full Name / పేరు', value: player.name },
    { label: "Father's Name / తండ్రి పేరు", value: player.fatherName },
    { label: 'Date of Birth / పుట్టిన తేదీ', value: player.dateOfBirth },
    { label: 'Gender / లింగం', value: player.gender },
    { label: 'Mobile Number / మొబైల్ సంఖ్య', value: player.mobile },
    { label: 'Email Address / ఈమెయిల్', value: player.email },
    { label: 'AP District / జిల్లా', value: player.district },
    { label: 'Division Category / విభాగం', value: player.tennikoitCategory },
    { label: 'Registration Number / రిజిస్ట్రేషన్ సంఖ్య', value: player.registrationNumber },
  ];

  return (
    <Box>
      <Button variant="outlined" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }} onClick={() => navigate('/admin/players')}>
        Back to Directory
      </Button>

      <PageTitle title={`Verify Profile — ${player.name}`} subtitle="Validate uploaded ID documents and status criteria" />

      <Grid container spacing={4}>
        <Grid  item xs={12} md={4}>
          <Card sx={{ borderTop: '3.5px solid #F4A300', textAlign: 'center', p: 4 }}>
            <Avatar
              src={player.photoUrl || ''}
              alt={player.name}
              sx={{ width: 140, height: 140, mx: 'auto', border: '3px solid #003366', mb: 3 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#003366', mb: 1 }}>
              {player.name}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontFamily: 'monospace', mb: 2 }}>
              ID: {player.registrationNumber || `APTAMP-${player.id}`}
            </Typography>
            <Box sx={{ mb: 3 }}>
              <StatusBadge status={player.status} />
            </Box>

            {player.status === 'PENDING' && (
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  startIcon={<CheckIcon />}
                  onClick={handleApprove}
                  sx={{ bgcolor: '#27AE60', '&:hover': { bgcolor: '#1e7e43' }, fontWeight: 700 }}
                >
                  Approve Registration
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  startIcon={<CloseIcon />}
                  onClick={handleReject}
                  sx={{ bgcolor: '#C0392B', '&:hover': { bgcolor: '#8e281e' }, fontWeight: 700 }}
                >
                  Reject Registration
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid  item xs={12} md={8}>
          <Card sx={{ borderTop: '3.5px solid #0057A8' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ color: '#003366', fontWeight: 700, mb: 3, fontFamily: "'Noto Serif', serif" }}>
                Athlete Registration Profile
              </Typography>
              <Grid container spacing={2}>
                {infoRows.map((row, idx) => (
                  <React.Fragment key={idx}>
                    <Grid  item xs={12} sm={4}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                        {row.label}
                      </Typography>
                    </Grid>
                    <Grid  item xs={12} sm={8}>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                        {row.value || 'Not Specified'}
                      </Typography>
                    </Grid>
                    {idx < infoRows.length - 1 && (
                      <Grid  item xs={12}>
                        <Divider sx={{ my: 0.5 }} />
                      </Grid>
                    )}
                  </React.Fragment>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
