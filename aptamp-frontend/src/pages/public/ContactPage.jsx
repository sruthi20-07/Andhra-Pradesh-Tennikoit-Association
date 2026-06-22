import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Container, Card, CardContent, Typography, TextField, Button, Box, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';;
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PageTitle from '../../components/common/PageTitle';
import { submitContactMessage } from '../../api/admin.api';

const contactSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  subject: yup.string().required('Subject is required'),
  message: yup.string().min(10, 'Message must be at least 10 characters').required('Message is required'),
});

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    try {
      await submitContactMessage(data);
      toast.success('Query submitted successfully.');
      reset();
    } catch (e) {
      toast.error('Failed to submit query. Please try again.');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <PageTitle title="Contact APTAMP / సంప్రదించండి" subtitle="Send queries directly to the executive committee or visit our secretariat offices" />

      <Grid container spacing={4}>
        {/* Contact Form */}
        <Grid  item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ color: '#003366', fontWeight: 700, mb: 3 }}>
                Send a Message / సందేశం పంపండి
              </Typography>
              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2}>
                  <Grid  item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      {...register('name')}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      size="small"
                    />
                  </Grid>
                  <Grid  item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      {...register('email')}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      size="small"
                    />
                  </Grid>
                  <Grid  item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      {...register('subject')}
                      error={!!errors.subject}
                      helperText={errors.subject?.message}
                      size="small"
                    />
                  </Grid>
                  <Grid  item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Your Message"
                      {...register('message')}
                      error={!!errors.message}
                      helperText={errors.message?.message}
                    />
                  </Grid>
                  <Grid  item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ bgcolor: '#0057A8', fontWeight: 700, py: 1.2, px: 4 }}
                    >
                      Submit Query
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Office Details */}
        <Grid  item xs={12} md={5}>
          <Card sx={{ borderLeft: '4px solid #F4A300', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{ color: '#0057A8', mt: 0.3 }}>
                  <BusinessIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#003366', mb: 0.5 }}>
                    APTA Head Office
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    APTA Secretariat, Indira Gandhi Municipal Stadium Complex, Guntur-Vijayawada Highway, Labbipet, Vijayawada, Andhra Pradesh, India - 520010
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderLeft: '4px solid #F4A300', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{ color: '#0057A8', mt: 0.3 }}>
                  <PhoneIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#003366', mb: 0.5 }}>
                    Phone Lines
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    General Queries: +91 866 244 5824
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Admin Secretariat: +91 866 244 5825
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderLeft: '4px solid #F4A300' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{ color: '#0057A8', mt: 0.3 }}>
                  <EmailIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#003366', mb: 0.5 }}>
                    Support Emails
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    General: info@aptennikoit.org
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Technical Support: support@aptennikoit.org
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
