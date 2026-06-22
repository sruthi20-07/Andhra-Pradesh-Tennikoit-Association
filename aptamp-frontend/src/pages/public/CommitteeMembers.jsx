import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Typography, Card, CardContent, Avatar, Box, Alert, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';;
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import committeeService from '../../services/committeeService';
import Loader from '../../components/common/Loader';

const MOCK_MEMBERS = [
  { id: 1, name: "Dr. K. Ramakrishna Prasad", role: "President", district: "Guntur", contact: "president@aptennikoit.org" },
  { id: 2, name: "Shri. P. Venugopal Rao", role: "General Secretary", district: "Vijayawada", contact: "secretary@aptennikoit.org" },
  { id: 3, name: "Smt. T. Satyavathi", role: "Treasurer", district: "Visakhapatnam", contact: "treasurer@aptennikoit.org" },
  { id: 4, name: "Shri. M. Ravindra Reddi", role: "Vice President", district: "Kurnool" },
  { id: 5, name: "Shri. D. Rajesh", role: "Joint Secretary", district: "Nellore" },
  { id: 6, name: "Shri. G. Srinivas", role: "Executive Member", district: "Anantapur" }
];

export default function CommitteeMembers() {
  const { data: members, isLoading, isError } = useQuery({
    queryKey: ['committeeMembers'],
    queryFn: committeeService.getMembers,
    retry: false
  });

  if (isLoading) {
    return <Loader message="Loading committee members..." />;
  }

  const memberList = members || MOCK_MEMBERS;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
        Executive Committee Members
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4, fontWeight: 500 }}>
        APTA Governing Council Members and Secretariat representatives.
      </Typography>
      <Divider sx={{ mb: 5 }} />

      {isError && (
        <Alert severity="info" sx={{ mb: 4 }}>
          Offline Mode: Displaying official governing council directories.
        </Alert>
      )}

      <Grid container spacing={3}>
        {memberList.map((m) => (
          <Grid key={m.id} item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                  <AccountBoxIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {m.name}
                  </Typography>
                  <Typography variant="subtitle2" color="secondary" sx={{ fontWeight: 600 }}>
                    {m.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    District: {m.district}
                  </Typography>
                  {m.contact && (
                    <Typography variant="caption" sx={{ color: 'primary.main', display: 'block', mt: 0.5 }}>
                      {m.contact}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
