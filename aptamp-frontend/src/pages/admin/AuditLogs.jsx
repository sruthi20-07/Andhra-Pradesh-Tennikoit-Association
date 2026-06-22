import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Typography, Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';;
import SearchIcon from '@mui/icons-material/Search';
import Loader from '../../components/common/Loader';
import auditLogService from '../../services/auditLogService';
import { formatDate } from '../../utils/formatters';

export default function AuditLogs() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const { data: logs, isLoading } = useQuery({
    queryKey: ['adminAuditLogs'],
    queryFn: auditLogService.getAuditLogs
  });

  if (isLoading) {
    return <Loader message="Loading system audit ledger..." />;
  }

  const list = logs || [];

  // Extract unique action types for filter
  const actionTypes = Array.from(new Set(list.map((log) => log.actionType)));

  const filtered = list.filter((log) => {
    const matchesAction = actionFilter === 'ALL' || log.actionType === actionFilter;
    const matchesSearch =
      log.actionType.toLowerCase().includes(search.toLowerCase()) ||
      log.tableName.toLowerCase().includes(search.toLowerCase()) ||
      (log.userEmail && log.userEmail.toLowerCase().includes(search.toLowerCase())) ||
      (log.actionDetails && log.actionDetails.toLowerCase().includes(search.toLowerCase()));
    return matchesAction && matchesSearch;
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, color: 'primary.dark' }}>
        System Audit Logs / లాగ్ వివరాలు
      </Typography>

      <Card sx={{ mb: 4, p: 2, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid  item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search logs by action, table, user..."
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
              label="Action Type"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <MenuItem value="ALL">All Actions</MenuItem>
              {actionTypes.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Operator</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Action</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Target Table</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Record ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Details</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Client IP</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  No system logs match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>#{log.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{log.userName}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">{log.userEmail}</Typography>
                    <Chip label={log.userRole} size="small" variant="outlined" sx={{ mt: 0.5, fontSize: '0.65rem', height: 16 }} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.actionType}
                      color={
                        log.actionType.startsWith('CREATE') || log.actionType.startsWith('SAVE')
                          ? 'success'
                          : log.actionType.startsWith('DELETE')
                          ? 'error'
                          : 'primary'
                      }
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{log.tableName}</TableCell>
                  <TableCell>{log.recordId || 'N/A'}</TableCell>
                  <TableCell sx={{ maxWidth: 200, wordBreak: 'break-word', fontSize: '0.85rem' }}>
                    {log.actionDetails}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem' }}>{log.clientIp || '127.0.0.1'}</TableCell>
                  <TableCell>{formatDate(log.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
