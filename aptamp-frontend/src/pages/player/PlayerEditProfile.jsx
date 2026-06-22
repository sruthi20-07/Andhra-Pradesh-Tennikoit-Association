import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Container, Card, CardContent, Typography, TextField, MenuItem, Button, Box, Stack, Avatar, CircularProgress,  } from '@mui/material';
import Grid from '@mui/material/Grid';;

import { getProfile, updateProfile, uploadFile } from '../../api/player.api';
import PageTitle from '../../components/common/PageTitle';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DISTRICTS = [
  'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 
  'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 
  'West Godavari', 'YSR Kadapa', 'Parvathipuram Manyam', 'Alluri Sitharama Raju', 
  'Anakapalli', 'Kakinada', 'Konaseema', 'Eluru', 'NTR', 'Palnadu', 
  'Bapatla', 'Nandyal', 'Sri Sathya Sai', 'Annamayya', 'Tirupati'
];

const editProfileSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  mobile: yup.string().matches(/^[0-9]{10}$/, 'Must be a 10-digit number').required('Mobile number is required'),
  fatherName: yup.string().required("Father's Name is required"),
  district: yup.string().required('District is required'),
  gender: yup.string().required('Gender is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
});

export default function PlayerEditProfile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['playerEditProfileData'],
    queryFn: getProfile,
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(editProfileSchema),
  });

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name || '');
      setValue('mobile', profile.mobile || '');
      setValue('fatherName', profile.fatherName || '');
      setValue('district', profile.district || '');
      setValue('gender', profile.gender || 'MALE');
      setValue('dateOfBirth', profile.dateOfBirth || '');
      if (profile.photoUrl) {
        setPhotoPreview(profile.photoUrl);
      }
    }
  }, [profile, setValue]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      let photoUrl = profile?.photoUrl || '';
      if (photoFile) {
        photoUrl = await uploadFile(photoFile);
      }

      await updateProfile({
        ...data,
        photoUrl,
      });

      queryClient.invalidateQueries(['playerProfileDetail']);
      queryClient.invalidateQueries(['playerDashboardProfile']);
      toast.success('Profile details saved successfully!');
      navigate('/player/profile');
    } catch (error) {
      toast.error('Failed to save profile. Please verify fields.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading Profile Data..." />;

  return (
    <Box>
      <PageTitle title="Edit Profile Details / ప్రొఫైల్ సవరణ" subtitle="Update your personal, registration, and sports parameters" />

      <Card sx={{ borderTop: '3.5px solid #0057A8' }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              {/* Photo upload preview on left */}
              <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} item xs={12} md={3}>
                <Avatar
                  src={photoPreview || ''}
                  alt={profile?.name}
                  sx={{ width: 130, height: 130, border: '3px solid #003366', mb: 2 }}
                />
                <Button variant="outlined" component="label" size="small" sx={{ textTransform: 'none' }}>
                  Upload Photo
                  <input type="file" hidden accept="image/png, image/jpeg, image/jpg" onChange={handlePhotoChange} />
                </Button>
              </Grid>

              {/* Form fields on right */}
              <Grid  item xs={12} md={9}>
                <Grid container spacing={2}>
                  <Grid  item xs={12} sm={6}>
                    <TextField fullWidth label="Full Name" {...register('name')} error={!!errors.name} helperText={errors.name?.message} size="small" />
                  </Grid>
                  <Grid  item xs={12} sm={6}>
                    <TextField fullWidth label="Father's Name" {...register('fatherName')} error={!!errors.fatherName} helperText={errors.fatherName?.message} size="small" />
                  </Grid>
                  <Grid  item xs={12} sm={6}>
                    <TextField fullWidth label="Mobile Number" {...register('mobile')} error={!!errors.mobile} helperText={errors.mobile?.message} size="small" />
                  </Grid>
                  <Grid  item xs={12} sm={6}>
                    <TextField fullWidth type="date" label="Date of Birth" slotProps={{ inputLabel: { shrink: true } }} {...register('dateOfBirth')} error={!!errors.dateOfBirth} helperText={errors.dateOfBirth?.message} size="small" />
                  </Grid>
                  <Grid  item xs={12} sm={6}>
                    <TextField select fullWidth label="District" defaultValue="" {...register('district')} error={!!errors.district} helperText={errors.district?.message} size="small" >
                      {DISTRICTS.map((d) => (
                        <MenuItem key={d} value={d}>{d}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid  item xs={12} sm={6}>
                    <TextField select fullWidth label="Gender" defaultValue="MALE" {...register('gender')} error={!!errors.gender} helperText={errors.gender?.message} size="small" >
                      <MenuItem value="MALE">Male</MenuItem>
                      <MenuItem value="FEMALE">Female</MenuItem>
                      <MenuItem value="OTHER">Other</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate('/player/profile')}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                sx={{ bgcolor: '#0057A8', fontWeight: 700, minWidth: 120 }}
              >
                {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
