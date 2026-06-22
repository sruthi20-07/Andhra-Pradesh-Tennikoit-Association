import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  Link,
  Stack,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOpenIcon from '@mui/icons-material/LockOpen';

import { login as loginApi } from '../../api/auth.api';
import { setCredentials } from '../../store/slices/authSlice';

const loginSchema = yup.object().shape({
  username: yup.string().email('Must be a valid email').required('Email or Username is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await loginApi(data.username, data.password);
      
      // Save credentials in Redux and localStorage
      dispatch(setCredentials({
        token: response.token,
        refreshToken: response.refreshToken,
        user: response.user
      }));

      toast.success('Login successful');
      
      // Redirect based on role
      const role = response.user.role;
      if (role === 'ROLE_PLAYER' || role === 'PLAYER' || role === 'ROLE_COACH' || role === 'COACH') {
        navigate('/player/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please verify credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 10, display: 'flex', justifyContent: 'center' }}>
      <Card
        sx={{
          width: '100%',
          maxWidth: 440,
          borderTop: '4px solid #003366', // Navy Government border
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        }}
      >
        {/* Emblem Watermark */}
        <Box
          sx={{
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            border: '8px solid rgba(0, 51, 102, 0.03)',
            pointerEvents: 'none',
          }}
        />

        <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Logo representation */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: 'rgba(0, 51, 102, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              color: '#003366',
            }}
          >
            <LockOpenIcon sx={{ fontSize: 32 }} />
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Noto Serif', serif",
              fontWeight: 700,
              color: '#003366',
              textAlign: 'center',
              mb: 0.5,
            }}
          >
            APTAMP Secure Login
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              fontWeight: 500,
              mb: 4,
            }}
          >
            సురక్షిత లాగిన్
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Email Address / ఈమెయిల్ చిరునామా"
                {...register('username')}
                error={!!errors.username}
                helperText={errors.username?.message}
                size="small"
              />
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Password / పాస్‌వర్డ్"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: '#003366',
                  color: '#ffffff',
                  fontWeight: 700,
                  py: 1.2,
                  '&:hover': {
                    bgcolor: '#002244',
                  },
                }}
              >
                {loading ? 'Authenticating...' : 'Login / లాగిన్'}
              </Button>
            </Stack>
          </Box>

          <Stack direction="row" justifyContent="space-between" sx={{ width: '100%', mt: 3.5 }}>
            <Link component={RouterLink} to="/forgot-password" sx={{ fontSize: '0.8rem', color: '#0057A8', fontWeight: 600, textDecoration: 'none' }}>
              Forgot Password?
            </Link>
            <Link component={RouterLink} to="/register" sx={{ fontSize: '0.8rem', color: '#FF6600', fontWeight: 700, textDecoration: 'none' }}>
              Register Player
            </Link>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
