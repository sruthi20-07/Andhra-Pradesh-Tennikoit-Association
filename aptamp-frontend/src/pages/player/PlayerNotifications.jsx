import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { Box, Card, CardContent, Typography, List, Button, Stack, Skeleton } from '@mui/material';
import DraftsIcon from '@mui/icons-material/Drafts';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import toast from 'react-hot-toast';

import PageTitle from '../../components/common/PageTitle';
import { getNotifications, markAsRead } from '../../api/notification.api';
import { markRead as markReadStore } from '../../store/slices/notificationSlice';

export default function PlayerNotifications() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { data: notificationsRaw = [], isLoading } = useQuery({
    queryKey: ['playerNotificationsList'],
    queryFn: getNotifications,
  });

  const notifications = Array.isArray(notificationsRaw) ? notificationsRaw : (notificationsRaw?.content || notificationsRaw?.data || []);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      dispatch(markReadStore(id));
      queryClient.invalidateQueries(['playerNotificationsList']);
      queryClient.invalidateQueries(['playerDashboardNotifications']);
      toast.success('Notification marked as read');
    } catch (err) {}
  };

  return (
    <Box>
      <PageTitle title="My Alerts & Communications / నోటిఫికేషన్లు" subtitle="Official circular alerts, bracket timings, and select trial results" />

      {isLoading ? (
        <Skeleton variant="rectangular" height={300} />
      ) : notifications.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#F5F7FA' }}>
          <Typography variant="body2" color="text.secondary">No announcements available.</Typography>
        </Card>
      ) : (
        <List sx={{ p: 0 }}>
          {notifications.map((n) => (
            <Card key={n.id} sx={{ mb: 2, borderLeft: n.isRead ? '4px solid #cbd5e1' : '4px solid #FF6600' }}>
              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#003366', mb: 1 }}>
                      {n.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.86rem', lineHeight: 1.5 }}>
                      {n.message}
                    </Typography>
                  </Box>
                  {!n.isRead && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<MarkEmailReadIcon />}
                      onClick={() => handleMarkAsRead(n.id)}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      Mark Read
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </List>
      )}
    </Box>
  );
}
