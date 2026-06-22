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

export default function RankingsPublicPage() {
  const [categoryId, setCategoryId] = useState(1); // 1 = Men's Singles default
  const [district, setDistrict] = useState('All Districts');

  const { data: rankingsRaw = [], isLoading } = useQuery({
    queryKey: ['publicRankings', categoryId, district],
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
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* CSS Print Styles */}
      <Box
        component="style"
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body * {
                visibility: hidden;
              }
              #printable-rankings, #printable-rankings * {
                visibility: visible;
              }
              #printable-rankings {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                color: #000000 !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `
        }}
      />

      <Stack direction="row" justifyContent="space-between" alignItems="center" className="no-print" sx={{ mb: 1 }}>
        <PageTitle title="Official Standings & Rankings / ర్యాంకింగ్స్" subtitle="Point systems calculated based on official tournament finishes" />
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ height: 40, fontWeight: 700 }}
        >
          Print Rankings
        </Button>
      </Stack>

      {/* Filter Options */}
      <Card sx={{ mb: 4 }} className="no-print">
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              select
              label="Age Category / Match Style"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              size="small"
              sx={{ flexGrow: 1, bgcolor: '#ffffff' }}
            >
              <MenuItem value={1}>Senior Men's Singles</MenuItem>
              <MenuItem value={2}>Senior Women's Singles</MenuItem>
              <MenuItem value={3}>Junior Boys Singles</MenuItem>
              <MenuItem value={4}>Junior Girls Singles</MenuItem>
            </TextField>
            <TextField
              select
              label="Filter by District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              size="small"
              sx={{ minWidth: 200, bgcolor: '#ffffff' }}
            >
              {DISTRICTS.map((dist) => (
                <MenuItem key={dist} value={dist}>{dist}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      {/* Standings Table container */}
      <Box id="printable-rankings">
        <Typography variant="h5" sx={{ display: { xs: 'none', print: 'block' }, mb: 2, fontWeight: 700 }}>
          APTAMP Official State Rankings — Category ID: {categoryId} | District: {district}
        </Typography>
        
        {isLoading ? (
          <Skeleton variant="rectangular" height={400} />
        ) : (
          <TableContainer component={Paper} sx={{ border: '1px solid #D1D9E0' }}>
            <Table size="medium">
              <TableHead sx={{ bgcolor: '#003366' }}>
                <TableRow>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Rank</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Athlete Name</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>District</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>State</TableCell>
                  <TableCell align="right" sx={{ color: '#ffffff', fontWeight: 700 }}>Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rankings.map((r, i) => (
                  <TableRow key={r.id || i} sx={{ bgcolor: i % 2 === 0 ? '#FFFFFF' : '#F5F7FA' }}>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {i === 0 ? '🏆 1' : i === 1 ? '🥈 2' : i === 2 ? '🥉 3' : i + 1}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{r.playerName}</TableCell>
                    <TableCell>{r.district}</TableCell>
                    <TableCell>{r.state || 'Andhra Pradesh'}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#0057A8', fontFamily: 'monospace' }}>
                      {r.points}
                    </TableCell>
                  </TableRow>
                ))}
                {rankings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      No points calculated yet for this category.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
}
