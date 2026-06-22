import React from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Stack, Switch, FormControlLabel, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';;
import toast from 'react-hot-toast';

import PageTitle from '../../../components/common/PageTitle';

export default function AdminSettings() {
  const handleSave = (e) => {
    e.preventDefault();
    toast.success('System configuration settings saved successfully!');
  };

  return (
    <Box>
      <PageTitle title="System Settings / సెట్టింగ్స్" subtitle="Configure portal metadata, tennikoit rules parameters, and API database parameters" />

      <Card sx={{ borderTop: '3.5px solid #0057A8' }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSave}>
            <Grid container spacing={3}>
              <Grid  item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#003366', mb: 2 }}>
                  Association Metadata
                </Typography>
                <Stack spacing={2.5}>
                  <TextField fullWidth label="Association Name (English)" defaultValue="Andhra Pradesh Tennikoit Association" size="small" />
                  <TextField fullWidth label="Association Name (Telugu)" defaultValue="ఆంధ్రప్రదేశ్ టెన్నికోయిట్ అసోసియేషన్" size="small" />
                  <TextField fullWidth label="Contact Email Support" defaultValue="support@aptennikoit.org" size="small" />
                  <TextField fullWidth label="System Support Helpline" defaultValue="+91 866 244 5824" size="small" />
                </Stack>
              </Grid>

              <Grid  item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#003366', mb: 2 }}>
                  Portal Features & Rules Selections
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel control={<Switch defaultChecked />} label="Enable Online Player Registration / ఆన్‌లైన్ నమోదు" />
                  <FormControlLabel control={<Switch defaultChecked />} label="Require Document Upload Verification for Selections" />
                  <FormControlLabel control={<Switch defaultChecked />} label="Verify Entry Payments via Offline Payment Verification" />
                  <FormControlLabel control={<Switch defaultChecked />} label="Enable Announcements Live Marquee Ticker" />
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button type="submit" variant="contained" sx={{ bgcolor: '#0057A8', fontWeight: 700 }}>
                Save System Settings
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
