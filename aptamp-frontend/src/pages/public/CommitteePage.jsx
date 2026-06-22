import React from 'react';
import { Container, Card, CardContent, Typography, Avatar, Box, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import PageTitle from '../../components/common/PageTitle';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PlaceIcon from '@mui/icons-material/Place';
import { useTranslation } from 'react-i18next';

const COMMITTEE_MEMBERS = [
  {
    id: 1,
    role: 'PATRON',
    name: 'PVGVR Naidu (Ghanababu)',
    details: ['Whip, Govt of AP', 'MLA Vizag West'],
  },
  {
    id: 2,
    role: 'CHAIRMAN',
    name: 'Y.D. Rama Rao',
    details: ['Indian Red Cross Society of AP'],
    phone: '9448080670',
    email: 'ramarao_yd@yahoo.co.in',
  },
  {
    id: 3,
    role: 'PRESIDENT',
    name: 'P. Ravindranadh',
    details: ['District SAP'],
    phone: '9440872255',
    email: 'ravindr94410@gmail.com',
  },
  {
    id: 4,
    role: 'SECRETARY GENERAL',
    name: 'K.N.V. Satyanarayana',
    details: ['D.No 19-7-53/1, Gavarapalem, Anakapalli'],
    phone: '7013643701',
  },
  {
    id: 5,
    role: 'EXECUTIVE PRESIDENT',
    name: 'Smt. A. Krishna Kumari',
    details: ['Chairperson of Clinics', 'Kakinada'],
    phone: '9441073145',
  },
  {
    id: 6,
    role: 'TREASURER',
    name: 'K. Ramesh',
    details: ['Mandapeta'],
    phone: '9705551345',
  }
];

export default function CommitteePage() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <PageTitle
        title={`${t('nav.committee')} / కార్యవర్గ కమిటీ`}
        subtitle="Office bearers and executive representatives governing state Tennikoit operations"
      />
      
      <Grid container spacing={3}>
        {COMMITTEE_MEMBERS.map((member) => (
          <Grid key={member.id} item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                borderTop: '4px solid #F4A300',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar sx={{ bgcolor: '#002244', width: 52, height: 52 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#FF6600', letterSpacing: '1px', display: 'block', mb: 0.5 }}>
                      {member.role}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#002244', mb: 1, fontSize: '1.05rem', lineHeight: 1.25 }}>
                      {member.name}
                    </Typography>
                    
                    <Stack spacing={0.8} sx={{ mt: 1.5 }}>
                      {member.details.map((detail, idx) => (
                        <Typography key={idx} variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PlaceIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                          {detail}
                        </Typography>
                      ))}
                      
                      {member.phone && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                          {member.phone}
                        </Typography>
                      )}
                      
                      {member.email && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1, wordBreak: 'break-all' }}>
                          <EmailIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                          {member.email}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
