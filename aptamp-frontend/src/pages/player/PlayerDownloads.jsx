import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Skeleton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PageTitle from '../../components/common/PageTitle';
import { getDownloads } from '../../api/download.api';

const MOCK_DOWNLOADS = [
  { id: 1, name: 'APTA Constitution & Guidelines', size: '1.8 MB', type: 'PDF', objectName: 'apta_constitution.pdf', description: 'Official registration guidelines and sports board bylaws.' },
  { id: 2, name: 'Tennikoit Rules & Playbook 2026', size: '2.4 MB', type: 'PDF', objectName: 'tennikoit_rules_2026.pdf', description: 'Court measurements, catch rules, and point calculation playbook.' },
  { id: 3, name: 'Referee Clinic circular', size: '920 KB', type: 'PDF', objectName: 'referee_clinic_july.pdf', description: 'Schedule and syllabus for the upcoming Guntur referee clinics.' }
];

export default function PlayerDownloads() {
  const { data: downloads = [], isLoading } = useQuery({
    queryKey: ['playerDownloadsList'],
    queryFn: async () => {
      const list = await getDownloads();
      const listArr = Array.isArray(list) ? list : (list?.content || list?.data || []);
      return listArr.length ? listArr : MOCK_DOWNLOADS;
    }
  });

  const handleDownload = (objectName) => {
    window.open(`http://localhost:8082/api/files/download?objectName=${objectName}`, '_blank');
  };

  return (
    <Box>
      <PageTitle title="Circulars & Documents / జీవోలు" subtitle="Official circulars, rule playbooks, and scoring documents" />

      {isLoading ? (
        <Skeleton variant="rectangular" height={250} />
      ) : (
        <TableContainer component={Paper} sx={{ border: '1px solid #D1D9E0' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#003366' }}>
              <TableRow>
                <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Document Name</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Format</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Size</TableCell>
                <TableCell align="right" sx={{ color: '#ffffff', fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {downloads.map((doc, idx) => (
                <TableRow key={doc.id || idx} sx={{ bgcolor: idx % 2 === 0 ? '#FFFFFF' : '#F5F7FA' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#003366' }}>{doc.name}</TableCell>
                  <TableCell>{doc.type || 'PDF'}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{doc.size || '1.1 MB'}</TableCell>
                  <TableCell align="right">
                    <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={() => handleDownload(doc.objectName)}>
                      Download
                    </Button>
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
