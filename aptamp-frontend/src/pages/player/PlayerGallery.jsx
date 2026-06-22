import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Container, Card, CardContent, CardMedia, Typography, Tabs, Tab, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid';;
import PageTitle from '../../components/common/PageTitle';
import { getGalleryItems } from '../../api/gallery.api';

export default function PlayerGallery() {
  const [tabVal, setTabVal] = useState('ALL');

  const { data: itemsRaw = [], isLoading } = useQuery({
    queryKey: ['playerGallery', tabVal],
    queryFn: () => {
      const typeParam = tabVal === 'ALL' ? undefined : tabVal;
      return getGalleryItems(typeParam ? { type: typeParam } : {});
    }
  });

  const items = Array.isArray(itemsRaw) ? itemsRaw : (itemsRaw?.content || itemsRaw?.data || []);

  return (
    <Box>
      <PageTitle title="Tournament Media / గ్యాలరీ" subtitle="Browse media snaps and match highlight reels" />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabVal} onChange={(e, newV) => setTabVal(newV)} textColor="primary" indicatorColor="primary">
          <Tab label="All Media" value="ALL" sx={{ fontWeight: 700 }} />
          <Tab label="Photos" value="IMAGE" sx={{ fontWeight: 700 }} />
          <Tab label="Videos" value="VIDEO" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Box>

      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2].map((n) => (
            <Grid key={n} item xs={12} sm={6}><Skeleton variant="rectangular" height={220} /></Grid>
          ))}
        </Grid>
      ) : items.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#F5F7FA' }}>
          <Typography variant="body2" color="text.secondary">No items found.</Typography>
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
                      sx={{ width: '100%', height: 200, border: 'none' }}
                      allowFullScreen
                    />
                  ) : (
                    <Box
                      component="video"
                      src={item.url}
                      controls
                      sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                    />
                  )
                ) : (
                  <CardMedia component="img" height="200" image={item.url} alt={item.title} />
                )}
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#003366' }}>{item.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
