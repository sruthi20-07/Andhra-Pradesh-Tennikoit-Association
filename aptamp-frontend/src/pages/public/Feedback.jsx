import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Typography, Box, Card, CardContent, TextField, Button, Rating, Alert, Container } from '@mui/material';
import Grid from '@mui/material/Grid';;
import SendIcon from '@mui/icons-material/Send';
import feedbackService from '../../services/feedbackService';

export default function Feedback() {
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: feedbackService.submitFeedback,
    onSuccess: () => {
      setSuccess(true);
      formik.resetForm();
      setTimeout(() => setSuccess(false), 6000);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to submit feedback.');
    }
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phoneNumber: '',
      subject: '',
      message: '',
      rating: 5
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phoneNumber: Yup.string().matches(/^[0-9]{10}$/, 'Must be a 10-digit number'),
      subject: Yup.string().required('Subject is required'),
      message: Yup.string().required('Message is required'),
      rating: Yup.number().min(1).max(5).required()
    }),
    onSubmit: (values) => {
      mutation.mutate(values);
    }
  });

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ textAlignment: 'center', mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.dark', mb: 1 }}>
          Feedback / సూచనలు
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We value your input. Please share your suggestions, experience, and feedback to help us improve the Andhra Pradesh Tennikoit Association Management Portal.
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>
          Thank you! Your feedback has been submitted successfully to the APTA administration.
          <br />
          ధన్యవాదాలు! మీ సూచనలు విజయవంతంగా సమర్పించబడ్డాయి.
        </Alert>
      )}

      <Card sx={{ borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid  item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Name / పేరు"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid  item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email / ఈమెయిల్"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid  item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number / ఫోన్ నంబర్"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                />
              </Grid>
              <Grid sx={{ display: 'flex', alignItems: 'center', gap: 2 }} item xs={12} sm={6}>
                <Typography component="legend" sx={{ fontWeight: 600 }}>Rating / రేటింగ్:</Typography>
                <Rating
                  name="rating"
                  value={formik.values.rating}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('rating', newValue);
                  }}
                  size="large"
                />
              </Grid>
              <Grid  item xs={12}>
                <TextField
                  fullWidth
                  id="subject"
                  name="subject"
                  label="Subject / విషయం"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.subject && Boolean(formik.errors.subject)}
                  helperText={formik.touched.subject && formik.errors.subject}
                />
              </Grid>
              <Grid  item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  id="message"
                  name="message"
                  label="Message / సందేశం"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.message && Boolean(formik.errors.message)}
                  helperText={formik.touched.message && formik.errors.message}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SendIcon />}
                disabled={mutation.isPending}
                sx={{ px: 6, py: 1.5, fontWeight: 700, borderRadius: 2 }}
              >
                Submit Feedback / సమర్పించండి
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
