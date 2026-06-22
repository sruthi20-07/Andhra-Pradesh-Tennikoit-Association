import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Skeleton,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CalculateIcon from '@mui/icons-material/Calculate';
import toast from 'react-hot-toast';

import PageTitle from '../../../components/common/PageTitle';
import { getStateRankings, recalculateRankings, updateRanking } from '../../../api/ranking.api';

export default function AdminRankingList() {
  const queryClient = useQueryClient();
  const [categoryId, setCategoryId] = useState(1);
  const [editedPoints, setEditedPoints] = useState({}); // maps rankingId -> points
  const [saving, setSaving] = useState(false);

  const { data: rankingsRaw = [], isLoading } = useQuery({
    queryKey: ['adminRankingsData', categoryId],
    queryFn: () => getStateRankings(categoryId),
  });

  const rankings = Array.isArray(rankingsRaw) ? rankingsRaw : (rankingsRaw?.content || rankingsRaw?.data || []);

  // Keep internal state of points when rankings are loaded
  useEffect(() => {
    if (rankings.length > 0) {
      const initialPoints = {};
      rankings.forEach((r) => {
        initialPoints[r.id] = r.points;
      });
      setEditedPoints(initialPoints);
    }
  }, [rankings]);

  const handlePointChange = (id, val) => {
    setEditedPoints({
      ...editedPoints,
      [id]: parseInt(val, 10) || 0,
    });
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const promises = Object.keys(editedPoints).map((id) =>
        updateRanking(id, { points: editedPoints[id] })
      );
      await Promise.all(promises);
      toast.success('Rankings points updated successfully');
      queryClient.invalidateQueries(['adminRankingsData', categoryId]);
    } catch (e) {
      toast.error('Failed to update rankings.');
    } finally {
      setSaving(false);
    }
  };

  const handleRecalculate = async () => {
    toast.loading('Recalculating standings...', { id: 'calc-toast' });
    try {
      await recalculateRankings();
      toast.success('Standings auto-calculated from match results!', { id: 'calc-toast' });
      queryClient.invalidateQueries(['adminRankingsData', categoryId]);
    } catch (e) {
      toast.error('Calculation failed.', { id: 'calc-toast' });
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <PageTitle title="Rankings Standings Management / ర్యాంకింగ్స్ సవరణ" subtitle="Edit athlete seeds, modify scoreboards, and auto-calculate standings" />
        
        <Stack direction="row" spacing={1.5}>
          <Tooltip title="Calculate ranks from finished tournament brackets">
            <Button
              variant="contained"
              startIcon={<CalculateIcon />}
              onClick={handleRecalculate}
              sx={{ bgcolor: '#0057A8' }}
            >
              Auto-Calculate Ranks
            </Button>
          </Tooltip>
          <Button
            variant="contained"
            color="success"
            startIcon={<SaveIcon />}
            disabled={saving || rankings.length === 0}
            onClick={handleSaveChanges}
            sx={{ bgcolor: '#27AE60', '&:hover': { bgcolor: '#1e7e43' } }}
          >
            Save Changes
          </Button>
        </Stack>
      </Stack>

      {/* Selections filter */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 2 }}>
          <TextField
            select
            label="Seeding Category"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            size="small"
            sx={{ minWidth: 250, bgcolor: '#ffffff' }}
          >
            <MenuItem value={1}>Senior Men's Singles</MenuItem>
            <MenuItem value={2}>Senior Women's Singles</MenuItem>
            <MenuItem value={3}>Junior Boys Singles</MenuItem>
            <MenuItem value={4}>Junior Girls Singles</MenuItem>
          </TextField>
        </CardContent>
      </Card>

      {isLoading ? (
        <Skeleton variant="rectangular" height={350} />
      ) : (
        <TableContainer component={Paper} sx={{ border: '1px solid #D1D9E0' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#003366' }}>
              <TableRow>
                <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Rank</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Player Name</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>District</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Category</TableCell>
                <TableCell align="right" sx={{ color: '#ffffff', fontWeight: 700, width: 180 }}>Points Seeding (Editable)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankings.map((r, i) => (
                <TableRow key={r.id || i} sx={{ bgcolor: i % 2 === 0 ? '#FFFFFF' : '#F5F7FA' }}>
                  <TableCell sx={{ fontWeight: 700 }}>#{r.currentRank || i + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{r.playerName}</TableCell>
                  <TableCell>{r.district}</TableCell>
                  <TableCell>{r.ageGroup}</TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      size="small"
                      value={editedPoints[r.id] !== undefined ? editedPoints[r.id] : r.points}
                      onChange={(e) => handlePointChange(r.id, e.target.value)}
                      inputProps={{ style: { textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 } }}
                      sx={{ width: 120 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {rankings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>No points calculated.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
