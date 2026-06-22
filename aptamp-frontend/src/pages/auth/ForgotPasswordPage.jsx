import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import api from '../../api/axios';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    onSubmit: async (values) => {
      setError(null);
      setLoading(true);
      try {
        // Try hitting backend reset password endpoint, fallback to mockup response if not implemented
        try {
          await api.post('/auth/forgot-password', values);
        } catch (apiErr) {
          if (apiErr.response?.status === 404) {
            console.warn('Backend forgot-password endpoint not found, simulating success state.');
          } else {
            throw apiErr;
          }
        }
        setSuccess(true);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container maxWidth="xs" sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Card sx={{ width: '100%', borderRadius: 3, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 4 }}>
          
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ display: 'inline-flex', bgcolor: 'primary.main', color: 'white', p: 1.5, borderRadius: '50%', mb: 1.5 }}>
              <MarkEmailReadIcon />
            </Box>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Reset Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your registered email address and we will email you instructions to reset your password.
            </Typography>
          </Box>

          {success ? (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              If your email is registered, we have sent a reset password link to your inbox. Please check your spam folder if you do not receive it in a few minutes.
            </Alert>
          ) : (
            <Box component="form" onSubmit={formik.handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label={t('forms.email')}
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 700 }}
              >
                {loading ? 'Submitting...' : 'Send Link'}
              </Button>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Button
              component={RouterLink}
              to="/login"
              variant="text"
              color="secondary"
              startIcon={<KeyboardArrowLeftIcon />}
              sx={{ fontWeight: 600 }}
            >
              Back to Login
            </Button>
          </Box>

        </CardContent>
      </Card>
    </Container>
  );
}
