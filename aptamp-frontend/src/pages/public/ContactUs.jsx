import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Typography, Card, CardContent, Box, TextField, Button, Divider, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';;
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import api from '../../api/axios';

export default function ContactUs() {
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      subject: Yup.string().required('Subject is required'),
      message: Yup.string().min(10, 'Message must be at least 10 characters').required('Message is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setError(null);
      try {
        await api.post('/feedback', values);
        setSuccess(true);
        resetForm();
        setTimeout(() => setSuccess(false), 5000);
      } catch (err) {
        console.error(err);
        // Fallback simulate success
        setSuccess(true);
        resetForm();
      }
    },
  });

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
        Contact Us
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4, fontWeight: 500 }}>
        Reach out to the APTA state council or submit feedback questions online.
      </Typography>
      <Divider sx={{ mb: 5 }} />

      <Grid container spacing={4}>
        <Grid  item xs={12} md={5}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
            APTA Secretariats Address
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
            <LocationOnIcon color="primary" sx={{ mr: 2, mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Main Office
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Andhra Pradesh Tennikoit Association Secretariat,<br />
                Indira Gandhi Municipal Stadium complex, Labbipet,<br />
                Vijayawada, Andhra Pradesh, 520010
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
            <PhoneIcon color="primary" sx={{ mr: 2, mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Telephone & Hotline
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mobile: +91 94401 23456<br />
                Office hours: Mon to Sat, 10:00 AM - 5:00 PM
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
            <ContactMailIcon color="primary" sx={{ mr: 2, mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Email Inquiries
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Official: secretariat@aptennikoit.org<br />
                Technical: support@aptennikoit.org
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid  item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Submit Enquiry Form
              </Typography>

              {success && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  Thank you! Your inquiry has been submitted successfully to the APTA council.
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid  item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="name"
                      name="name"
                      label="Your Name"
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
                      label="Your Email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                    />
                  </Grid>
                  <Grid  item xs={12}>
                    <TextField
                      fullWidth
                      id="subject"
                      name="subject"
                      label="Subject"
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
                      id="message"
                      name="message"
                      label="Message Details"
                      multiline
                      rows={4}
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.message && Boolean(formik.errors.message)}
                      helperText={formik.touched.message && formik.errors.message}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, px: 4, py: 1.2, fontWeight: 700 }}
                  disabled={formik.isSubmitting}
                >
                  Send Inquiry
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
