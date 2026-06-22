import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid';
import InfoIcon from '@mui/icons-material/Info';

import PageTitle from '../../components/common/PageTitle';
import StatusBadge from '../../components/common/StatusBadge';
import { getMyRegistrations } from '../../api/tournament.api';

export default function PlayerPayments() {
  // Fetch registrations
  const { data: registrations = [], isLoading: loadRegs } = useQuery({
    queryKey: ['playerRegsForPayment'],
    queryFn: getMyRegistrations,
  });

  return (
    <Box>
      <PageTitle title="Offline Payments Status" subtitle="Track your tournament registration fees and offline payment approvals" />

      <Grid container spacing={4}>
        {/* Instructions */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderLeft: '4.5px solid #0057A8', bgcolor: '#f4f9ff', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <InfoIcon color="primary" />
                <Typography variant="h6" sx={{ color: '#003366', fontWeight: 700 }}>
                  Offline Payment Guidelines
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ lineHeight: 1.7, color: '#333333' }}>
                Andhra Pradesh Tennikoit Association collects all registration entry fees offline.
              </Typography>
              <Box component="ol" sx={{ pl: 2.5, mt: 1.5, '& li': { mb: 1, fontSize: '0.88rem', color: '#444444' } }}>
                <li>Select your category and register for the desired tournament.</li>
                <li>Contact your district secretary or the tournament organizer to pay the entry fee.</li>
                <li>Provide your Registration Number and tournament details during payment.</li>
                <li>Once the organizer verifies the offline receipt, your status will be updated to <strong>PAID</strong> and your entry <strong>CONFIRMED</strong>.</li>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Ledger table */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" sx={{ color: '#003366', fontWeight: 700, mb: 2 }}>
            Your Tournaments & Payment Status
          </Typography>
          {loadRegs ? (
            <Skeleton variant="rectangular" height={300} />
          ) : registrations.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#F5F7FA' }}>
              <Typography variant="body2" color="text.secondary">No tournament registrations found.</Typography>
            </Card>
          ) : (
            <TableContainer component={Paper} sx={{ border: '1px solid #D1D9E0' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#003366' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Tournament</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Category</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Entry Fee</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Payment Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {registrations.map((reg, idx) => (
                    <TableRow key={reg.id || idx} sx={{ bgcolor: idx % 2 === 0 ? '#FFFFFF' : '#F5F7FA' }}>
                      <TableCell sx={{ fontWeight: 600 }}>{reg.tournament?.title}</TableCell>
                      <TableCell>{reg.category?.categoryName}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#0057A8' }}>₹{reg.tournament?.entryFee}</TableCell>
                      <TableCell>
                        <StatusBadge status={reg.paymentStatus} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
