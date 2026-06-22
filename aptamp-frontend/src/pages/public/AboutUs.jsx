import React from 'react';
import { Container, Typography, Box, Card, CardContent, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';;
import SportsIcon from '@mui/icons-material/Sports';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';

export default function AboutUs() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
        About APTA
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4, fontWeight: 500 }}>
        Governing the sport of Tennikoit across Andhra Pradesh, fostering athletic excellence since inception.
      </Typography>
      <Divider sx={{ mb: 5 }} />

      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid  item xs={12} md={6}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
            Our History & Background
          </Typography>
          <Typography variant="body1" paragraph>
            The Andhra Pradesh Tennikoit Association (APTA) was established to promote, popularize, and manage the sport of Tennikoit (Ring Tennis) within the state of Andhra Pradesh. Affiliate with the Tennikoit Federation of India (TFI) and recognized by the State Olympic Association and Sports Authority, APTA has served as the launchpad for numerous national-level champions.
          </Typography>
          <Typography variant="body1">
            APTA coordinates district-level championships, selectors trials, referee clinics, and national participation selections. Through this digital platform, APTAMP, we strive to bring complete transparency to player registries, rankings, and event management.
          </Typography>
        </Grid>
        <Grid  item xs={12} md={6}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=600"
            alt="Tennikoit athletes matching"
            sx={{ width: '100%', borderRadius: 2, border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {[
          { title: "Our Mission", text: "To identify, nurture, and prepare young Tennikoit talents from rural and urban parts of AP for national and international championships.", icon: <SportsIcon color="primary" fontSize="large" /> },
          { title: "Our Vision", text: "To make Tennikoit one of the most accessible and celebrated sports in the state, supported by world-class digital infrastructures.", icon: <AssistantPhotoIcon color="primary" fontSize="large" /> },
          { title: "Quality & Governance", text: "Providing fair, unbiased selections and maintaining clean anti-doping policies in coordination with sports ministries.", icon: <EmojiEventsIcon color="primary" fontSize="large" /> }
        ].map((item, i) => (
          <Grid key={i} item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>{item.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.text}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
