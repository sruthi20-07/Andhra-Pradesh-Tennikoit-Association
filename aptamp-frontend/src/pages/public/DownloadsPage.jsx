import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid';;
import DownloadIcon from '@mui/icons-material/Download';
import PageTitle from '../../components/common/PageTitle';
import { getDownloads } from '../../api/download.api';

const MOCK_DOWNLOADS = [
  { id: 1, name: 'APTA Constitution & Guidelines', size: '1.8 MB', type: 'PDF', objectName: 'apta_constitution.pdf', description: 'Official registration guidelines and sports board bylaws.' },
  { id: 2, name: 'Tennikoit Rules & Playbook 2026', size: '2.4 MB', type: 'PDF', objectName: 'tennikoit_rules_2026.pdf', description: 'Court measurements, catch rules, and point calculation playbook.' },
  { id: 3, name: 'Referee Clinic circular', size: '920 KB', type: 'PDF', objectName: 'referee_clinic_july.pdf', description: 'Schedule and syllabus for the upcoming Guntur referee clinics.' }
];

export default function DownloadsPage() {
  const { data: downloadsRaw = [], isLoading } = useQuery({
    queryKey: ['publicDownloads'],
    queryFn: async () => {
      const list = await getDownloads();
      const listArr = Array.isArray(list) ? list : (list?.content || list?.data || []);
      return listArr.length ? listArr : MOCK_DOWNLOADS;
    }
  });

  const downloads = Array.isArray(downloadsRaw) ? downloadsRaw : (downloadsRaw?.content || downloadsRaw?.data || []);

  const handleDownload = (objectName) => {
    // Navigate or trigger download stream from file download controller
    window.open(`http://localhost:8082/api/files/download?objectName=${objectName}`, '_blank');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <PageTitle title="Circulars & Downloads / ఫైళ్లు & జీవోలు" subtitle="Download official tennikoit guidelines, forms, scoring playbooks, and state records" />

      {isLoading ? (
        <Skeleton variant="rectangular" height={300} />
      ) : (
        <Grid container spacing={4}>
          <Grid  item xs={12}>
            <TableContainer component={Paper} sx={{ border: '1px solid #D1D9E0' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#003366' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Document Name</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Description</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Format</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>Size</TableCell>
                    <TableCell align="right" sx={{ color: '#ffffff', fontWeight: 700 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {downloads.map((doc, idx) => (
                    <TableRow key={doc.id || idx} sx={{ bgcolor: idx % 2 === 0 ? '#FFFFFF' : '#F5F7FA' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#003366' }}>{doc.name}</TableCell>
                      <TableCell>{doc.description || 'Association circular documentation'}</TableCell>
                      <TableCell>{doc.type || 'PDF'}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{doc.size || '1.2 MB'}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownload(doc.objectName)}
                        >
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
