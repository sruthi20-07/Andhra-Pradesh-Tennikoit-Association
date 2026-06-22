import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Typography, Box, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';;
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import Loader from '../../components/common/Loader';
import certificateService from '../../services/certificateService';
import tournamentService from '../../services/tournamentService';
import { formatDate } from '../../utils/formatters';

export default function CertificatesManager() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState('');
  const [certType, setCertType] = useState('PARTICIPATION');

  const { data: certificates, isLoading: isCertsLoading } = useQuery({
    queryKey: ['adminCertificates'],
    queryFn: certificateService.getCertificates
  });

  const { data: registrations, isLoading: isRegsLoading } = useQuery({
    queryKey: ['adminRegistrations'],
    queryFn: () => tournamentService.getRegistrations({ status: 'APPROVED' })
  });

  const issueMutation = useMutation({
    mutationFn: certificateService.issueCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCertificates'] });
      setFormOpen(false);
      setSelectedReg('');
      setCertType('PARTICIPATION');
      alert('Certificate issued successfully.');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to issue certificate.');
    }
  });

  if (isCertsLoading || isRegsLoading) {
    return <Loader message="Loading certificates data..." />;
  }

  const handleIssue = () => {
    if (!selectedReg) {
      alert('Please select a registration record.');
      return;
    }
    issueMutation.mutate({
      registrationId: selectedReg,
      certificateType: certType
    });
  };

  const list = certificates || [];
  const regs = registrations || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.dark' }}>
          Manage Certificates
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
          sx={{ borderRadius: 2, fontWeight: 700 }}
        >
          Issue New Certificate
        </Button>
      </Box>

      {list.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No certificates have been issued yet. Click "Issue New Certificate" to generate one.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Player Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Tournament</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Certificate Number</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Date Issued</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>#{c.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{c.playerName}</Typography>
                    <Typography variant="caption" color="text.secondary">{c.playerDistrict}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{c.tournamentName}</Typography>
                    <Typography variant="caption" color="text.secondary">{c.categoryName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={c.certificateType} size="small" color="primary" sx={{ fontWeight: 650 }} />
                  </TableCell>
                  <TableCell><code>{c.certificateNumber}</code></TableCell>
                  <TableCell>{formatDate(c.issuedAt)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DownloadIcon />}
                      href={c.fileUrl}
                      target="_blank"
                      sx={{ borderRadius: 2 }}
                    >
                      Print PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Issue Certificate Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Issue Certificate</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid  item xs={12}>
              <TextField
                select
                fullWidth
                label="Select Registration Record"
                value={selectedReg}
                onChange={(e) => setSelectedReg(e.target.value)}
              >
                {regs.length === 0 ? (
                  <MenuItem disabled>No approved tournament registrations found</MenuItem>
                ) : (
                  regs.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.playerName} - {r.tournamentName} ({r.categoryName})
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            <Grid  item xs={12}>
              <TextField
                select
                fullWidth
                label="Certificate Type"
                value={certType}
                onChange={(e) => setCertType(e.target.value)}
              >
                <MenuItem value="PARTICIPATION">Participation Certificate</MenuItem>
                <MenuItem value="MERIT">Merit Certificate</MenuItem>
                <MenuItem value="EXCELLENCE">Excellence Certificate</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button
            onClick={handleIssue}
            variant="contained"
            color="success"
            disabled={issueMutation.isPending}
            sx={{ px: 3 }}
          >
            Issue Certificate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
