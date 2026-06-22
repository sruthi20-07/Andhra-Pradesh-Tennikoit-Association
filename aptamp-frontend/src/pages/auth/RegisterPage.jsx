import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Container, Card, CardContent, Typography, Stepper, Step, StepLabel, Button, Box, TextField, MenuItem, RadioGroup, FormControlLabel, Radio, FormLabel, Stack, Alert, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { register as registerApi } from '../../api/auth.api';
import { uploadFile } from '../../api/player.api';

const DISTRICTS = [
  'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 
  'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 
  'West Godavari', 'YSR Kadapa', 'Parvathipuram Manyam', 'Alluri Sitharama Raju', 
  'Anakapalli', 'Kakinada', 'Konaseema', 'Eluru', 'NTR', 'Palnadu', 
  'Bapatla', 'Nandyal', 'Sri Sathya Sai', 'Annamayya', 'Tirupati'
];

const CATEGORIES = ['SUB_JUNIOR', 'JUNIOR', 'SENIOR', 'OPEN'];

// Yup Registration Schema
const registrationSchema = yup.object().shape({
  name: yup.string().required('Please enter your full name'),
  fatherName: yup.string().required("Father/Guardian Name is required"),
  email: yup.string().email('Please enter a valid email').required('Please enter a valid email'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords do not match')
    .required('Confirm Password must match'),
  mobile: yup.string().matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits').required('Mobile number is required'),
  dateOfBirth: yup.string()
    .required('Date of birth is required')
    .test('age-check', 'Athlete must be at least 5 years old', (value) => {
      if (!value) return false;
      const dob = new Date(value);
      const limit = new Date();
      limit.setFullYear(limit.getFullYear() - 5);
      return dob <= limit;
    }),
  gender: yup.string().required('Gender selection is required'),
  district: yup.string().required('District is required'),
  committee: yup.string().required('Committee is required'),
  category: yup.string().required('Please select a category'),
  experience: yup.number().typeError('Must be a number').min(0, 'Experience cannot be negative').required('Experience is required'),
  prevAssociation: yup.string().optional(),
});

function Step1() {
  const { register, control, watch, clearErrors, formState: { errors } } = useFormContext();
  
  // Watch form data for debug logging
  const formData = watch();
  console.log("Current formData:", formData);
  console.log("Current validation errors:", errors);
  console.log("Current gender value:", formData.gender);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Full Name (English) / పూర్తి పేరు" {...register('name')} error={!!errors.name} helperText={errors.name?.message} size="small" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Father's / Guardian Name" {...register('fatherName')} error={!!errors.fatherName} helperText={errors.fatherName?.message} size="small" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Email Address" {...register('email')} error={!!errors.email} helperText={errors.email?.message} size="small" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Mobile Number" {...register('mobile')} error={!!errors.mobile} helperText={errors.mobile?.message} size="small" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth type="password" label="Portal Account Password" {...register('password')} error={!!errors.password} helperText={errors.password?.message} size="small" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth type="password" label="Confirm Password" {...register('confirmPassword')} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} size="small" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth type="date" label="Date of Birth" slotProps={{ inputLabel: { shrink: true } }} {...register('dateOfBirth')} error={!!errors.dateOfBirth} helperText={errors.dateOfBirth?.message} size="small" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField select fullWidth label="District / జిల్లా" defaultValue="" {...register('district')} error={!!errors.district} helperText={errors.district?.message} size="small" >
          {DISTRICTS.map((d) => (
            <MenuItem key={d} value={d}>{d}</MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <FormLabel component="legend">Gender / లింగం</FormLabel>
        <Controller
          name="gender"
          control={control}
          render={({ field: { onChange, value } }) => (
            <RadioGroup
              row
              value={value || "MALE"}
              onChange={(e) => {
                const val = e.target.value;
                onChange(val);
                if (val) {
                  // Explicitly remove validation error when a value is selected
                  clearErrors('gender');
                }
                console.log("Gender:", val);
              }}
            >
              <FormControlLabel value="MALE" control={<Radio checked={(value || "MALE") === 'MALE'} />} label="Male / పురుషుడు" />
              <FormControlLabel value="FEMALE" control={<Radio checked={value === 'FEMALE'} />} label="Female / స్త్రీ" />
              <FormControlLabel value="OTHER" control={<Radio checked={value === 'OTHER'} />} label="Other / ఇతర" />
            </RadioGroup>
          )}
        />
        {errors.gender && (
          <Typography color="error" variant="caption">
            {errors.gender.message}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}

function Step2() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField select fullWidth label="AP District Committee / జిల్లా కమిటీ" defaultValue="" {...register('committee')} error={!!errors.committee} helperText={errors.committee?.message} size="small" >
          {DISTRICTS.map((d) => (
            <MenuItem key={d} value={d}>{d}</MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField select fullWidth label="Sport Division Category" defaultValue="" {...register('category')} error={!!errors.category} helperText={errors.category?.message} size="small" >
          {CATEGORIES.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth type="number" label="Tennikoit Experience (Years)" {...register('experience')} error={!!errors.experience} helperText={errors.experience?.message} size="small" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Previous Club / Association Name (if any)" {...register('prevAssociation')} error={!!errors.prevAssociation} helperText={errors.prevAssociation?.message} size="small" />
      </Grid>
    </Grid>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [uploading, setUploading] = useState(false);

  const methods = useForm({
    resolver: yupResolver(registrationSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      fatherName: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobile: '',
      dateOfBirth: '',
      gender: 'MALE',
      district: '',
      committee: '',
      category: '',
      experience: 0,
      prevAssociation: ''
    }
  });

  const handleNext = async () => {
    let fieldsToValidate = [];
    if (activeStep === 0) {
      fieldsToValidate = ['name', 'fatherName', 'email', 'password', 'confirmPassword', 'mobile', 'dateOfBirth', 'gender', 'district'];
    } else if (activeStep === 1) {
      fieldsToValidate = ['committee', 'category', 'experience'];
    }

    const isStepValid = await methods.trigger(fieldsToValidate);
    if (isStepValid) {
      setActiveStep((prev) => prev + 1);
    } else {
      toast.error('Please correct the validation errors before proceeding.');
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPG, JPEG, and PNG files are allowed.');
        setPhotoFile(null);
        setPhotoPreview(null);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        setPhotoFile(null);
        setPhotoPreview(null);
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setPhotoError('');
    }
  };

  const onSubmit = async (data) => {
    setUploading(true);
    try {
      let finalPhotoUrl = '';
      if (photoFile) {
        try {
          finalPhotoUrl = await uploadFile(photoFile);
        } catch (uploadError) {
          console.error("Photo upload failed, proceeding with null/empty photo URL:", uploadError);
          finalPhotoUrl = '';
        }
      }

      const registerPayload = {
        name: data.name,
        email: data.email,
        password: data.password,
        mobile: data.mobile,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        fatherName: data.fatherName,
        district: data.district,
        category: data.category,
        photoUrl: finalPhotoUrl,
        state: 'Andhra Pradesh',
        experienceYears: Number(data.experience) || 0
      };

      console.log("REGISTER REQUEST", registerPayload);
      const response = await registerApi(registerPayload);
      console.log("REGISTER RESPONSE", response);
      
      setSuccess(true);
      toast.success('Registration submitted successfully.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.log("REGISTER ERROR", error.response?.data);
      const msg = error.response?.data?.message || error.response?.data || error.message || 'Submission failed. Please check inputs.';
      toast.error(typeof msg === 'object' ? JSON.stringify(msg) : String(msg));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {success ? (
        <Card sx={{ borderTop: '4px solid #27AE60', textAlign: 'center', p: 4 }}>
          <CardContent>
            <CheckCircleIcon sx={{ fontSize: 72, color: '#27AE60', mb: 2 }} />
            <Typography variant="h4" sx={{ fontFamily: "'Noto Serif', serif", fontWeight: 700, color: '#003366', mb: 2 }}>
              Registration Completed!
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: '600px', mx: 'auto', lineHeight: 1.6 }}>
              Registration submitted successfully. Awaiting admin approval.
            </Typography>
            <Button variant="contained" component={RouterLink} to="/login" sx={{ fontWeight: 700, px: 4 }}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ borderTop: '4px solid #003366' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontFamily: "'Noto Serif', serif", fontWeight: 700, color: '#003366', mb: 1, textAlign: 'center' }}>
              APTAMP Player Enrollment Portal
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, textAlign: 'center' }}>
              ఆటగాళ్ల నమోదు విధానం — Stepper Application
            </Typography>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
              <Step><StepLabel>Personal Details</StepLabel></Step>
              <Step><StepLabel>Sports Details</StepLabel></Step>
              <Step><StepLabel>Upload Document</StepLabel></Step>
            </Stepper>

            <FormProvider {...methods}>
              <Box component="form" noValidate>
                {activeStep === 0 && <Step1 />}
                {activeStep === 1 && <Step2 />}
                {activeStep === 2 && (
                  <Stack spacing={3} alignItems="center">
                    <Alert severity="info" sx={{ width: '100%' }}>
                      Please upload a passport-size profile photograph (Max size 2MB, JPG/PNG only)
                    </Alert>
                    
                    <Stack direction="row" alignItems="center" spacing={3}>
                      {photoPreview ? (
                        <Box sx={{ width: 100, height: 100, border: '2px solid #D1D9E0', borderRadius: '4px', overflow: 'hidden' }}>
                          <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                      ) : (
                        <Box sx={{ width: 100, height: 100, border: '2px dashed #D1D9E0', borderRadius: '4px', bgcolor: '#F5F7FA' }} />
                      )}
                      
                      <Button variant="outlined" component="label">
                        Choose Photograph
                        <input type="file" hidden accept="image/png, image/jpeg, image/jpg" onChange={handlePhotoChange} />
                      </Button>
                    </Stack>
                    
                    {photoError && (
                      <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                        {photoError}
                      </Typography>
                    )}
                  </Stack>
                )}

                <Divider sx={{ my: 4 }} />

                <Stack direction="row" justifyContent="space-between">
                  <Button variant="outlined" disabled={activeStep === 0} onClick={handleBack}>
                    Back
                  </Button>
                  
                  {activeStep < 2 ? (
                    <Button variant="contained" onClick={handleNext}>
                      Next
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={methods.handleSubmit(onSubmit)}
                      disabled={uploading}
                      sx={{ bgcolor: '#FF6600', '&:hover': { bgcolor: '#d95300' } }}
                    >
                      {uploading ? 'Submitting Application...' : 'Submit Enrollment'}
                    </Button>
                  )}
                </Stack>
              </Box>
            </FormProvider>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
