import React from 'react';
import { Container, Card, CardContent, Typography, Box, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';;
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HelpIcon from '@mui/icons-material/Help';
import PageTitle from '../../components/common/PageTitle';

export default function AboutPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <PageTitle title="About APTA / మా గురించి" subtitle="Learn about the Andhra Pradesh Tennikoit Association and the history of Tennikoit" />
      
      <Grid container spacing={4}>
        <Grid  item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ color: '#003366', fontWeight: 700, mb: 2, fontFamily: "'Noto Serif', serif" }}>
                Our Mission & Objectives
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, color: 'text.primary' }}>
                The Andhra Pradesh Tennikoit Association (APTA) is the apex governing body for the sport of Tennikoit in the state of Andhra Pradesh, India. Affiliated with the Tennikoit Federation of India (TKFI) and recognized by the Sports Authority of Andhra Pradesh (SAAP), APTA has been promoting, organizing, and developing the sport since its inception.
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, color: 'text.primary' }}>
                Our core objectives are:
              </Typography>
              <ul>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Identifying raw tennikoit talent in rural and urban schools across the 26 districts of AP.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Conducting regular coaching camps led by certified state coaches to hone athlete skills.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Hosting annual District-level and State-level Championships for Sub-Junior, Junior, and Senior classes.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Maintaining high standards of refereeing through formal clinics and licensing programs.
                  </Typography>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ color: '#003366', fontWeight: 700, mb: 2, fontFamily: "'Noto Serif', serif" }}>
                History of Tennikoit
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                Tennikoit, also known as Ring Tennis, is a classic sport played on a double court using a circular rubber ring. Originating in Germany and brought to India, the sport requires extreme agility, reflexes, and precision. It is played in singles, doubles, and mixed doubles formats.
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                A match consists of 3 sets, and each set is won by the player who first scores 21 points with a lead of 2 clear points. The ring must be caught with only one hand and returned immediately without any delay (wobbling or shaking the wrist) or body contact.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid  item xs={12} md={4}>
          <Card sx={{ borderLeft: '4px solid #F4A300', mb: 4 }}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <EmojiEventsIcon color="primary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#003366' }}>
                  Recognition
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                APTAMP is verified and monitored under the Sports Department of the Government of Andhra Pradesh. High-ranking state players are eligible for official sports reservations, national trials selection, and scholarship honors.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderLeft: '4px solid #0057A8' }}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                <HelpIcon color="primary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#003366' }}>
                  Helpdesk
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                For enrollment queries, registration support, or grievance filing:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Email: secretary@aptennikoit.org
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Phone: +91 866 244 5824
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

