import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Typography, Card, CardContent, Button, Box, Divider, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';;
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';

import downloadService from '../../services/downloadService';
import Loader from '../../components/common/Loader';

const MOCK_DOWNLOADS = [
  { id: 1, name: "APTA Official Tennikoit Rulebook (Edition 2026)", size: "2.4 MB", type: "PDF", objectName: "rulebook.pdf" },
  { id: 2, name: "District Roster Athlete Registration Form (Offline Copy)", size: "480 KB", type: "PDF", objectName: "athlete_form.pdf" },
  { id: 3, name: "Medical and DOB Proof declaration format", size: "320 KB", type: "DOCX", objectName: "dob_declaration.docx" },
  { id: 4, name: "Referee Licensing application circular guidelines", size: "1.1 MB", type: "PDF", objectName: "referee_circular.pdf" }
];

export default function Downloads() {
  const { data: downloads, isLoading, isError } = useQuery({
    queryKey: ['downloadsList'],
    queryFn: downloadService.getDownloads,
    retry: false
  });

  if (isLoading) {
    return <Loader message="Loading download resources..." />;
  }

  const downloadList = downloads || MOCK_DOWNLOADS;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
        Official Circulars & Downloads
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4, fontWeight: 500 }}>
        Download official documents, medical certificates format, rulebooks, and referee circulars.
      </Typography>
      <Divider sx={{ mb: 5 }} />

      {isError && (
        <Alert severity="info" sx={{ mb: 4 }}>
          Offline Mode: Displaying official document catalogs.
        </Alert>
      )}

      <Grid container spacing={3}>
        {downloadList.map((doc) => (
          <Grid key={doc.id} item xs={12} sm={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <DescriptionIcon color="primary" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {doc.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Size: {doc.size} | Type: {doc.type}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  href={`http://localhost:8082/api/files/download?objectName=${doc.objectName}`}
                  target="_blank"
                  sx={{ borderRadius: 2 }}
                >
                  Download
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
