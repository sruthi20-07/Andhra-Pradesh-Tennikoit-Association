import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Card, CardContent, CardMedia, Typography, Tabs, Tab, Box, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid';;
import PageTitle from '../../components/common/PageTitle';
import { getGalleryItems } from '../../api/gallery.api';

export default function GalleryPublicPage() {
  const [tabVal, setTabVal] = useState('ALL');

  const { data: itemsRaw = [], isLoading } = useQuery({
    queryKey: ['publicGallery', tabVal],
    queryFn: () => {
      const typeParam = tabVal === 'ALL' ? undefined : tabVal;
      return getGalleryItems(typeParam ? { type: typeParam } : {});
    }
  });

  const items = Array.isArray(itemsRaw) ? itemsRaw : (itemsRaw?.content || itemsRaw?.data || []);

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <PageTitle title="Association Media Gallery / ఫోటోలు & వీడియోలు" subtitle="Action snaps and video highlights from APTA championships" />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={tabVal}
          onChange={(e, newV) => setTabVal(newV)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="All Media" value="ALL" sx={{ fontWeight: 700 }} />
          <Tab label="Photos" value="IMAGE" sx={{ fontWeight: 700 }} />
          <Tab label="Videos" value="VIDEO" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Box>

      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((n) => (
            <Grid key={n} item xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" height={220} />
            </Grid>
          ))}
        </Grid>
      ) : items.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center', bgcolor: '#F5F7FA' }}>
          <Typography variant="body1" color="text.secondary">No media found in the gallery.</Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid key={item.id} item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%' }}>
                {item.type === 'VIDEO' ? (
                  item.url && (item.url.includes('youtube.com') || item.url.includes('youtu.be')) ? (
                    <Box
                      component="iframe"
                      src={item.url.includes('watch?v=') ? item.url.replace('watch?v=', 'embed/') : item.url.includes('youtu.be/') ? `https://www.youtube.com/embed/${item.url.split('youtu.be/')[1]?.split('?')[0]}` : item.url}
                      title={item.title}
                      sx={{ width: '100%', height: 220, border: 'none' }}
                      allowFullScreen
                    />
                  ) : (
                    <Box
                      component="video"
                      src={item.url}
                      controls
                      sx={{ width: '100%', height: 220, objectFit: 'cover' }}
                    />
                  )
                ) : (
                  <CardMedia
                    component="img"
                    height="220"
                    image={item.url}
                    alt={item.title}
                    sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.04)' } }}
                  />
                )}
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#003366', mb: 0.5 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {item.description || 'Tennikoit Event Snapshot'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
