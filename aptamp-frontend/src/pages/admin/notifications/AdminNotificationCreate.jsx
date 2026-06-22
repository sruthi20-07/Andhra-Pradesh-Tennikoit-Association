import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Box, Card, CardContent, TextField, Button, Stack, Divider } from '@mui/material';

import PageTitle from '../../../components/common/PageTitle';
import { createNotification } from '../../../api/notification.api';

const notificationSchema = yup.object().shape({
  title: yup.string().required('Notification Title is required'),
  message: yup.string().min(10, 'Message must be at least 10 characters').required('Message is required'),
});

export default function AdminNotificationCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(notificationSchema),
  });

  const onSubmit = async (data) => {
    try {
      await createNotification({
        title: data.title,
        message: data.message,
        type: 'announcement',
      });
      toast.success('Notification alert broadcasted successfully!');
      queryClient.invalidateQueries(['adminNotificationsList']);
      queryClient.invalidateQueries(['homeNotifications']);
      queryClient.invalidateQueries(['playerNotificationsList']);
      queryClient.invalidateQueries(['playerDashboardNotifications']);
      navigate('/admin/notifications');
    } catch (e) {
      const msg = e.response?.data?.message || 'Failed to dispatch alert.';
      toast.error(msg);
    }
  };

  return (
    <Box>
      <PageTitle title="Dispatch Circular Notice / సర్క్యులర్ సృష్టి" subtitle="Broadcast system alerts, referee notifications, and ticker items to all state players" />

      <Card sx={{ borderTop: '3.5px solid #0057A8', maxWidth: 650 }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Circular Title / శీర్షిక"
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title?.message}
                size="small"
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Alert Details / సందేశం"
                {...register('message')}
                error={!!errors.message}
                helperText={errors.message?.message}
              />

              <Divider />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => navigate('/admin/notifications')}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" sx={{ bgcolor: '#0057A8', fontWeight: 700 }}>
                  Broadcast Notice
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
