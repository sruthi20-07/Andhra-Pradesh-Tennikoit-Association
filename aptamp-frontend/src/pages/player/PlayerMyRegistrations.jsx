import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, Box, Skeleton } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

import { getMyRegistrations } from '../../api/tournament.api';
import PageTitle from '../../components/common/PageTitle';
import StatusBadge from '../../components/common/StatusBadge';

export default function PlayerMyRegistrations() {
  const navigate = useNavigate();

  const { data: list = [], isLoading } = useQuery({
    queryKey: ['playerMyRegistrations'],
    queryFn: getMyRegistrations,
  });

  return (
    <Box>
      <PageTitle title="My Tournament Registrations / నా రిజిస్ట్రేషన్లు" subtitle="Status of your tournament entries and registration fees ledger" />

      {isLoading ? (
        <Skeleton variant="rectangular" height={300} />
      ) : list.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center', bgcolor: '#F5F7FA' }}>
          <HelpIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, mb: 3 }}>
            No registrations yet. Browse tournaments to register.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/player/tournaments')}>
            Browse Tournaments
          </Button>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ border: '1px solid #D1D9E0' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#003366' }}>
              <TableRow>
                <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Tournament</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Registered Date</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Payment</TableCell>
                <TableCell align="right" sx={{ color: '#ffffff', fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((reg, idx) => {
                const canPay = reg.paymentStatus === 'UNPAID' && reg.status === 'APPROVED';
                return (
                  <TableRow key={reg.id || idx} sx={{ bgcolor: idx % 2 === 0 ? '#FFFFFF' : '#F5F7FA' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#003366' }}>
                      {reg.tournament?.title}
                    </TableCell>
                    <TableCell>
                      {reg.category?.categoryName} ({reg.category?.gender})
                    </TableCell>
                    <TableCell>
                      {reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={reg.status} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={reg.paymentStatus} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                        {canPay && (
                          <Button
                            variant="contained"
                            size="small"
                            color="warning"
                            onClick={() => navigate('/player/payments')}
                            sx={{ fontWeight: 700, bgcolor: '#FF6600', '&:hover': { bgcolor: '#d95300' } }}
                          >
                            Pay Fee
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/player/tournaments/${reg.tournament?.id}`)}
                        >
                          View Details
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
