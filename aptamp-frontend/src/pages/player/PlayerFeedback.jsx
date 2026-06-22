import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Box, Card, CardContent, Typography, TextField, Button, MenuItem, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';;
import { useSelector } from 'react-redux';

import PageTitle from '../../components/common/PageTitle';
import axiosInstance from '../../api/axiosInstance';

const feedbackSchema = yup.object().shape({
  subject: yup.string().required('Subject is required'),
  message: yup.string().min(10, 'Message must be at least 10 characters').required('Message is required'),
  rating: yup.number().min(1).max(5).required('Rating is required'),
});

export default function PlayerFeedback() {
  const { user } = useSelector((state) => state.auth);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(feedbackSchema),
    defaultValues: {
      rating: 5,
    }
  });

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post('/feedback', {
        name: user?.name || 'AP Athlete',
        email: user?.email || 'athlete@aptennikoit.org',
        phoneNumber: user?.mobile || '',
        subject: data.subject,
        message: data.message,
        rating: data.rating,
      });
      toast.success('Feedback submitted successfully');
      reset();
    } catch (err) {
      toast.error('Failed to submit feedback.');
    }
  };

  return (
    <Box>
      <PageTitle title="Submit Portal Feedback / అభిప్రాయం" subtitle="File queries, feedback or technical suggestions with the APTA sports committee" />

      <Card sx={{ borderTop: '3.5px solid #0057A8', maxWidth: 600 }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={3}>
              <TextField
                select
                fullWidth
                label="Overall Rating Selections"
                defaultValue={5}
                {...register('rating')}
                error={!!errors.rating}
                helperText={errors.rating?.message}
                size="small"
              >
                <MenuItem value={5}>⭐⭐⭐⭐⭐ (Excellent / చాలా బాగుంది)</MenuItem>
                <MenuItem value={4}>⭐⭐⭐⭐ (Very Good / బాగుంది)</MenuItem>
                <MenuItem value={3}>⭐⭐⭐ (Average / పర్వాలేదు)</MenuItem>
                <MenuItem value={2}>⭐⭐ (Poor / సరిగ్గా లేదు)</MenuItem>
                <MenuItem value={1}>⭐ (Very Poor / చాలా చెడ్డది)</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Subject / విషయం"
                {...register('subject')}
                error={!!errors.subject}
                helperText={errors.subject?.message}
                size="small"
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Detailed Message / మీ అభిప్రాయం"
                {...register('message')}
                error={!!errors.message}
                helperText={errors.message?.message}
              />

              <Button
                type="submit"
                variant="contained"
                sx={{ bgcolor: '#003366', fontWeight: 700, py: 1.2 }}
              >
                Submit Feedback
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
