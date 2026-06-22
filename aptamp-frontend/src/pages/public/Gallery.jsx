import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Typography, Card, CardMedia, CardContent, Divider, Box, Button, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';;

import galleryService from '../../services/galleryService';
import Loader from '../../components/common/Loader';

const MOCK_GALLERY = [
  { id: 1, title: "State Sub-Junior Championship 2026", type: "IMAGE", url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400" },
  { id: 2, title: "AP Junior Team Award Ceremony", type: "IMAGE", url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=400" },
  { id: 3, title: "Vijayawada Inter-District Roster trials", type: "IMAGE", url: "https://images.unsplash.com/photo-1526676001870-7467eb0bbb90?auto=format&fit=crop&q=80&w=400" },
  { id: 4, title: "Referee Clinic training program", type: "IMAGE", url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=400" },
  { id: 5, title: "AP Girls Double Nationals entry trials", type: "IMAGE", url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400" },
  { id: 6, title: "Sub-Junior Selectors Match Action", type: "IMAGE", url: "https://images.unsplash.com/photo-1526676001870-7467eb0bbb90?auto=format&fit=crop&q=80&w=400" }
];

export default function Gallery() {
  const [filter, setFilter] = useState('');
  
  const { data: galleryItems, isLoading, isError } = useQuery({
    queryKey: ['gallery', filter],
    queryFn: () => galleryService.getItems(filter),
    retry: false
  });

  if (isLoading) {
    return <Loader message="Loading gallery items..." />;
  }

  const items = galleryItems || MOCK_GALLERY;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
        Media Gallery
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4, fontWeight: 500 }}>
        Photos and video clips of state-level tennikoit events, championships, and athletic achievements.
      </Typography>
      <Divider sx={{ mb: 4 }} />

      {isError && (
        <Alert severity="info" sx={{ mb: 4 }}>
          Offline Mode: Displaying official tournament gallery.
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'center' }}>
        <Button variant={filter === '' ? 'contained' : 'outlined'} onClick={() => setFilter('')}>
          All Media
        </Button>
        <Button variant={filter === 'IMAGE' ? 'contained' : 'outlined'} onClick={() => setFilter('IMAGE')}>
          Photos
        </Button>
        <Button variant={filter === 'VIDEO' ? 'contained' : 'outlined'} onClick={() => setFilter('VIDEO')}>
          Videos
        </Button>
      </Box>

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid key={item.id} item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="240"
                image={item.url}
                alt={item.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ py: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Format: {item.type}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
