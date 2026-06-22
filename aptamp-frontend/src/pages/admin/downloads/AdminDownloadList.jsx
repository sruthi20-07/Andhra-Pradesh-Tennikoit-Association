import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, Skeleton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import toast from 'react-hot-toast';

import PageTitle from '../../../components/common/PageTitle';
import { getDownloads, deleteDownload } from '../../../api/download.api';

export default function AdminDownloadList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: downloadsRaw = [], isLoading } = useQuery({
    queryKey: ['adminDownloadsList'],
    queryFn: getDownloads,
  });

  const downloads = Array.isArray(downloadsRaw) ? downloadsRaw : (downloadsRaw?.content || downloadsRaw?.data || []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await deleteDownload(id);
      toast.success('Document deleted successfully');
      queryClient.invalidateQueries(['adminDownloadsList']);
    } catch (err) {
      toast.error('Deletion failed.');
    }
  };

  const handleDownload = (objectName) => {
    window.open(`http://localhost:8082/api/files/download?objectName=${objectName}`, '_blank');
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <PageTitle title="Circular Archives / ఫైళ్లు" subtitle="Upload rule books, scoring guidelines, or official notifications" />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/downloads/upload')}
          sx={{ height: 40, bgcolor: '#0057A8' }}
        >
          Add Document
        </Button>
      </Stack>

      {isLoading ? (
        <Skeleton variant="rectangular" height={300} />
      ) : downloads.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#F5F7FA' }}>
          <Typography variant="body2" color="text.secondary">No documents uploaded.</Typography>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ border: '1px solid #D1D9E0' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#003366' }}>
              <TableRow>
                <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Document Name</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Size</TableCell>
                <TableCell align="right" sx={{ color: '#ffffff', fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {downloads.map((doc, idx) => (
                <TableRow key={doc.id || idx} sx={{ bgcolor: idx % 2 === 0 ? '#FFFFFF' : '#F5F7FA' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#003366' }}>{doc.name}</TableCell>
                  <TableCell>{doc.type || 'PDF'}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{doc.size || '1.2 MB'}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={() => handleDownload(doc.objectName)}>
                        Download
                      </Button>
                      <Button variant="outlined" size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(doc.id)}>
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
