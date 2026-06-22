import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Container, Card, CardContent, Box, Typography, Button, Divider, Stack, Avatar } from '@mui/material';
import Grid from '@mui/material/Grid';;
import EditIcon from '@mui/icons-material/Edit';

import { getProfile } from '../../api/player.api';
import PageTitle from '../../components/common/PageTitle';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function PlayerProfile() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['playerProfileDetail'],
    queryFn: getProfile,
  });

  if (isLoading) return <LoadingSpinner message="Loading Profile..." />;

  const displayData = profile || {
    name: user?.name || 'N/A',
    email: user?.email || 'N/A',
    mobile: user?.mobile || 'N/A',
    district: user?.district || 'N/A',
    status: user?.status || 'PENDING',
    registrationNumber: 'APTAMP-N/A',
    gender: 'MALE',
    dateOfBirth: 'N/A',
    fatherName: 'N/A',
    tennikoitCategory: 'SENIOR',
  };

  const infoRows = [
    { label: 'Full Name / పేరు', value: displayData.name },
    { label: "Father's Name / తండ్రి పేరు", value: displayData.fatherName },
    { label: 'Date of Birth / పుట్టిన తేదీ', value: displayData.dateOfBirth },
    { label: 'Gender / లింగం', value: displayData.gender },
    { label: 'Mobile Number / మొబైల్ సంఖ్య', value: displayData.mobile },
    { label: 'Email Address / ఈమెయిల్', value: displayData.email },
    { label: 'AP District / జిల్లా', value: displayData.district },
    { label: 'Division Category / విభాగం', value: displayData.tennikoitCategory },
    { label: 'Registration Number / రిజిస్ట్రేషన్ సంఖ్య', value: displayData.registrationNumber || `APTAMP-${displayData.id}` },
  ];

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <PageTitle title="My Athlete Profile / నా ప్రొఫైల్" subtitle="Official registration record filed with APTAMP" />
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate('/player/profile/edit')}
          sx={{ bgcolor: '#0057A8' }}
        >
          Edit Profile
        </Button>
      </Stack>

      <Grid container spacing={4}>
        {/* Left Side: Avatar & status */}
        <Grid  item xs={12} md={4}>
          <Card sx={{ borderTop: '3.5px solid #F4A300', textAlign: 'center', p: 4 }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
              <Avatar
                src={displayData.photoUrl || ''}
                alt={displayData.name}
                sx={{ width: 140, height: 140, mx: 'auto', border: '3px solid #003366' }}
              />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#003366', mb: 1 }}>
              {displayData.name}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontFamily: 'monospace', mb: 2 }}>
              {displayData.registrationNumber || `APTAMP-${displayData.id}`}
            </Typography>
            <StatusBadge status={displayData.status} />
          </Card>
        </Grid>

        {/* Right Side: Detailed rows */}
        <Grid  item xs={12} md={8}>
          <Card sx={{ borderTop: '3.5px solid #0057A8' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ color: '#003366', fontWeight: 700, mb: 3, fontFamily: "'Noto Serif', serif" }}>
                Profile Registry Details
              </Typography>
              <Grid container spacing={2}>
                {infoRows.map((row, idx) => (
                  <React.Fragment key={idx}>
                    <Grid  item xs={12} sm={5}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                        {row.label}
                      </Typography>
                    </Grid>
                    <Grid  item xs={12} sm={7}>
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
