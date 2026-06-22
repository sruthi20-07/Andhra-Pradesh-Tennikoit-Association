import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography, Button, List, Stack, Skeleton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import PageTitle from '../../../components/common/PageTitle';
import { getNotifications } from '../../../api/notification.api';

export default function AdminNotificationList() {
  const navigate = useNavigate();

  const { data: notificationsRaw = [], isLoading } = useQuery({
    queryKey: ['adminNotificationsList'],
    queryFn: getNotifications,
  });

  const notifications = Array.isArray(notificationsRaw) ? notificationsRaw : (notificationsRaw?.content || notificationsRaw?.data || []);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <PageTitle title="Announcements & Alerts / నోటిఫికేషన్లు" subtitle="Broadcast system alerts, circular notices, and ticker items to players" />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/notifications/create')}
          sx={{ height: 40, bgcolor: '#0057A8' }}
        >
          Dispatch Alert
        </Button>
      </Stack>

      {isLoading ? (
        <Skeleton variant="rectangular" height={300} />
      ) : notifications.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#F5F7FA' }}>
          <Typography variant="body2" color="text.secondary">No announcements dispatched yet.</Typography>
        </Card>
      ) : (
        <List sx={{ p: 0 }}>
          {notifications.map((n) => (
            <Card key={n.id} sx={{ mb: 2, borderLeft: '4px solid #FF6600' }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#003366', mb: 0.5 }}>
                  {n.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {n.message}
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1, textAlign: 'right' }}>
                  Type: {n.type}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </List>
      )}
    </Box>
  );
}
