import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Typography, Box, Card, CardContent, Button, TextField, MenuItem, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';;
import SendIcon from '@mui/icons-material/Send';
import api from '../../api/axios';

export default function NotificationsManager() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('ANNOUNCEMENT');
  const [success, setSuccess] = useState(false);

  const notifyMutation = useMutation({
    mutationFn: async (payload) => {
      await api.post('/notifications', payload);
    },
    onSuccess: () => {
      setSuccess(true);
      setTitle('');
      setMessage('');
      setType('ANNOUNCEMENT');
      setTimeout(() => setSuccess(false), 5000);
      alert('Notification sent successfully to all players!');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to dispatch alert.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !message) {
      alert('Please fill out all fields');
      return;
    }
    notifyMutation.mutate({ title, message, type });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Broadcast Notifications & Alerts
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          Your system alert broadcast was successfully transmitted to the target players directory!
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid  item xs={12}>
                <TextField
                  fullWidth
                  label="Notice Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
              <Grid  item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Alert Category"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <MenuItem value="ANNOUNCEMENT">Public Announcement</MenuItem>
                  <MenuItem value="SELECTION">Selection Trial Notice</MenuItem>
                  <MenuItem value="CRITICAL">Critical Alert / Warning</MenuItem>
                </TextField>
              </Grid>
              <Grid  item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Broadcast Message Content"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SendIcon />}
                disabled={notifyMutation.isPending}
                sx={{ px: 4, py: 1.2, fontWeight: 700, borderRadius: 2 }}
              >
                {notifyMutation.isPending ? 'Sending...' : 'Send Broadcast'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
