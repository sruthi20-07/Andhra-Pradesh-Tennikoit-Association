import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Card, CardContent, Typography, TextField, MenuItem, Stack, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import PageTitle from '../../components/common/PageTitle';
import { getStateRankings, getDistrictRankings } from '../../api/ranking.api';

const DISTRICTS = [
  'All Districts', 'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 
  'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'
];

export default function PlayerRankings() {
  const [categoryId, setCategoryId] = useState(1);
  const [district, setDistrict] = useState('All Districts');

  const { data: rankingsRaw = [], isLoading } = useQuery({
    queryKey: ['playerRankingsList', categoryId, district],
    queryFn: () => {
      if (district && district !== 'All Districts') {
        return getDistrictRankings(categoryId, district);
      }
      return getStateRankings(categoryId);
    }
  });

  const rankings = Array.isArray(rankingsRaw) ? rankingsRaw : (rankingsRaw?.content || rankingsRaw?.data || []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box>
      <Box component="style" dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body * { visibility: hidden; }
            #printable-player-rankings, #printable-player-rankings * { visibility: visible; }
            #printable-player-rankings { position: absolute; left: 0; top: 0; width: 100%; color: #000000 !important; }
            .no-print { display: none !important; }
          }
        `
      }} />

      <Stack direction="row" justifyContent="space-between" alignItems="center" className="no-print" sx={{ mb: 1 }}>
        <PageTitle title="State Standings & Points Seeding / రాష్ట్ర ర్యాంకింగ్స్" subtitle="Interactive database search for state seed standings" />
        <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ height: 40 }}>
          Print View
        </Button>
      </Stack>

      <Card sx={{ mb: 4 }} className="no-print">
        <CardContent sx={{ p: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              select
              fullWidth
              label="Select Division Category"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              size="small"
              sx={{ bgcolor: '#ffffff' }}
            >
              <MenuItem value={1}>Senior Men's Singles</MenuItem>
              <MenuItem value={2}>Senior Women's Singles</MenuItem>
              <MenuItem value={3}>Junior Boys Singles</MenuItem>
              <MenuItem value={4}>Junior Girls Singles</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="AP District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              size="small"
              sx={{ bgcolor: '#ffffff' }}
            >
              {DISTRICTS.map((d) => (
                <MenuItem key={d} value={d}>{d}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      <Box id="printable-player-rankings">
        {isLoading ? (
          <Skeleton variant="rectangular" height={350} />
        ) : (
          <TableContainer component={Paper} sx={{ border: '1px solid #D1D9E0' }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#003366' }}>
                <TableRow>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Rank</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Athlete Name</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>District</TableCell>
                  <TableCell align="right" sx={{ color: '#ffffff', fontWeight: 700 }}>Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rankings.map((r, i) => (
                  <TableRow key={r.id || i} sx={{ bgcolor: i % 2 === 0 ? '#FFFFFF' : '#F5F7FA' }}>
                    <TableCell sx={{ fontWeight: 700 }}>#{i + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{r.playerName}</TableCell>
                    <TableCell>{r.district}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#0057A8', fontFamily: 'monospace' }}>
                      {r.points}
                    </TableCell>
                  </TableRow>
                ))}
                {rankings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>No rankings recorded.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
