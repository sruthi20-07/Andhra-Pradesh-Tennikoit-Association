import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { 
  Box, Card, CardContent, Typography, TextField, MenuItem, Button, 
  Stack, FormControlLabel, Checkbox, Divider, CircularProgress, Paper, Chip 
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import InputAdornment from '@mui/material/InputAdornment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import PageTitle from '../../../components/common/PageTitle';
import { createTournament } from '../../../api/admin.api';
import { uploadFile } from '../../../api/player.api';

// Strict validation schema preventing date overlaps
const createSchema = yup.object().shape({
  title: yup.string().required('Tournament title is required'),
  description: yup.string().required('Description is required'),
  venue: yup.string().required('Venue is required'),
  startDate: yup.mixed().required('Start date is required')
    .test('valid-start-date', 'Invalid start date', value => value && dayjs(value).isValid()),
  endDate: yup.mixed().required('End date is required')
    .test('valid-end-date', 'Invalid end date', value => value && dayjs(value).isValid())
    .test('after-start', 'End date must be on or after start date', function(value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return dayjs(value).isSame(dayjs(startDate)) || dayjs(value).isAfter(dayjs(startDate));
    }),
  registrationDeadline: yup.mixed().required('Registration deadline is required')
    .test('valid-deadline', 'Invalid deadline', value => value && dayjs(value).isValid())
    .test('before-start', 'Registration deadline must be before start date', function(value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return dayjs(value).isBefore(dayjs(startDate));
    }),
  entryFee: yup.number().typeError('Must be a number').min(0, 'Entry fee cannot be negative').required('Entry fee is required'),
  status: yup.string().required('Status is required'),
});

const statusOptions = [
  { value: 'DRAFT',     label: 'Draft (Internal)' },
  { value: 'PUBLISHED', label: 'Published (Public)' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'COMPLETED', label: 'Completed' },
];

export default function AdminTournamentCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCats, setSelectedCats] = useState({
    SUB_JUNIOR: false,
    JUNIOR: false,
    SENIOR: true,
    OPEN: true,
  });

  const [brochureFile, setBrochureFile] = useState(null);
  const [guidelinesFile, setGuidelinesFile] = useState(null);
  const [ruleBookFile, setRuleBookFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(createSchema),
    defaultValues: {
      title: '',
      description: '',
      venue: '',
      startDate: null,
      endDate: null,
      registrationDeadline: null,
      entryFee: 0,
      status: 'PUBLISHED',
    }
  });

  // Watch form values for live preview panel
  const watchAllFields = watch();

  const handleCatChange = (e) => {
    setSelectedCats({
      ...selectedCats,
      [e.target.name]: e.target.checked,
    });
  };

  const onSubmit = async (data) => {
    // Map categories
    const categoriesList = Object.keys(selectedCats)
      .filter((key) => selectedCats[key])
      .map((key) => ({
        categoryName: key === 'SUB_JUNIOR' ? 'Sub-Junior' : key === 'JUNIOR' ? 'Junior' : key === 'SENIOR' ? 'Senior' : 'Open',
        gender: 'ANY',
        minAge: key === 'SUB_JUNIOR' ? 8 : key === 'JUNIOR' ? 14 : key === 'SENIOR' ? 18 : 0,
        maxAge: key === 'SUB_JUNIOR' ? 14 : key === 'JUNIOR' ? 18 : key === 'SENIOR' ? 35 : 99,
      }));

    if (categoriesList.length === 0) {
      toast.error('Please select at least one division category.');
      return;
    }

    setUploading(true);
    try {
      const documentsList = [];

      // 1. Upload brochure if exists
      if (brochureFile) {
        const brochureUrl = await uploadFile(brochureFile, 'tournaments');
        documentsList.push({
          fileName: brochureFile.name,
          filePath: brochureUrl,
          fileType: 'BROCHURE',
        });
      }

      // 2. Upload guidelines if exists
      if (guidelinesFile) {
        const guidelinesUrl = await uploadFile(guidelinesFile, 'tournaments');
        documentsList.push({
          fileName: guidelinesFile.name,
          filePath: guidelinesUrl,
          fileType: 'GUIDELINES',
        });
      }

      // 3. Upload rulebook if exists
      if (ruleBookFile) {
        const ruleBookUrl = await uploadFile(ruleBookFile, 'tournaments');
        documentsList.push({
          fileName: ruleBookFile.name,
          filePath: ruleBookUrl,
          fileType: 'RULEBOOK',
        });
      }

      // 4. Save tournament
      await createTournament({
        ...data,
        startDate: dayjs(data.startDate).format('YYYY-MM-DD'),
        endDate: dayjs(data.endDate).format('YYYY-MM-DD'),
        registrationDeadline: dayjs(data.registrationDeadline).toISOString(),
        categories: categoriesList,
        documents: documentsList,
      });

      toast.success('Tournament created successfully');
      queryClient.invalidateQueries(['adminTournamentsList']);
      queryClient.invalidateQueries(['upcomingTournaments']);
      queryClient.invalidateQueries(['playerDashboardTournaments']);
      queryClient.invalidateQueries(['playerTournaments']);
      navigate('/admin/tournaments');
    } catch (e) {
      const msg = e.response?.data?.message || 'Failed to create tournament.';
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ pb: 6 }}>
        <PageTitle 
          title="Publish Tournament / పోటీ ప్రకటన" 
          subtitle="Initialize and declare official AP state brackets, select timelines, and attach official documents" 
        />

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={4}>
            
            {/* LEFT COLUMN: Input sections 1 to 5 (8 columns width) */}
            <Grid item xs={12} lg={7.5}>
              <Stack spacing={3}>
                
                {/* SECTION 1: Tournament Information */}
                <Card sx={{ borderTop: '4px solid #003366', borderRadius: '4px' }}>
                  <CardContent sx={{ p: 3.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#003366', mb: 2.5 }}>
                      Section 1: Tournament Information / టోర్నమెంట్ సమాచారం
                    </Typography>
                    
                    <Grid container spacing={2.5}>
                      <Grid item xs={12}>
                        <TextField 
                          fullWidth 
                          label="Tournament Title / పోటీ పేరు" 
                          {...register('title')} 
                          error={!!errors.title} 
                          helperText={errors.title?.message} 
                          size="small" 
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField 
                          fullWidth 
                          multiline 
                          rows={4} 
                          label="Description & Event Guidelines" 
                          {...register('description')} 
                          error={!!errors.description} 
                          helperText={errors.description?.message} 
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField 
                          fullWidth 
                          label="Venue Location" 
                          {...register('venue')} 
                          error={!!errors.venue} 
                          helperText={errors.venue?.message} 
                          size="small" 
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField 
                          select 
                          fullWidth 
                          label="Publication Status" 
                          defaultValue="PUBLISHED" 
                          {...register('status')} 
                          error={!!errors.status} 
                          helperText={errors.status?.message} 
                          size="small"
                        >
                          {statusOptions.map(opt => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* SECTION 2: Schedule & Timelines */}
                <Card sx={{ borderTop: '4px solid #003366', borderRadius: '4px' }}>
                  <CardContent sx={{ p: 3.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#003366', mb: 2.5 }}>
                      Section 2: Schedule & Timelines / తేదీలు
                    </Typography>
                    
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="startDate"
                          control={control}
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <DatePicker
                              label="Start Date / ప్రారంభ తేదీ"
                              value={value}
                              onChange={onChange}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: !!error,
                                  helperText: error?.message,
                                  size: "small"
                                }
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="endDate"
                          control={control}
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <DatePicker
                              label="End Date / ముగింపు తేదీ"
                              value={value}
                              onChange={onChange}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: !!error,
                                  helperText: error?.message,
                                  size: "small"
                                }
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Controller
                          name="registrationDeadline"
                          control={control}
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <DateTimePicker
                              label="Registration Deadline / గడువు తేదీ"
                              value={value}
                              onChange={onChange}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: !!error,
                                  helperText: error?.message,
                                  size: "small"
                                }
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* SECTION 3: Division Categories */}
                <Card sx={{ borderTop: '4px solid #003366', borderRadius: '4px' }}>
                  <CardContent sx={{ p: 3.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#003366', mb: 1.5 }}>
                      Section 3: Division Categories / విభాగాలు
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2.5 }}>
                      Select the age categories allowed to register for this championship tournament.
                    </Typography>
                    
                    <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
                      <FormControlLabel 
                        control={<Checkbox checked={selectedCats.SUB_JUNIOR} onChange={handleCatChange} name="SUB_JUNIOR" />} 
                        label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Sub-Junior (U-14)</Typography>} 
                      />
                      <FormControlLabel 
                        control={<Checkbox checked={selectedCats.JUNIOR} onChange={handleCatChange} name="JUNIOR" />} 
                        label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Junior (U-18)</Typography>} 
                      />
                      <FormControlLabel 
                        control={<Checkbox checked={selectedCats.SENIOR} onChange={handleCatChange} name="SENIOR" />} 
                        label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Senior (18-35)</Typography>} 
                      />
                      <FormControlLabel 
                        control={<Checkbox checked={selectedCats.OPEN} onChange={handleCatChange} name="OPEN" />} 
                        label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Open Category</Typography>} 
                      />
                    </Stack>
                  </CardContent>
                </Card>

                {/* SECTION 4: Entry Fee Structure */}
                <Card sx={{ borderTop: '4px solid #003366', borderRadius: '4px' }}>
                  <CardContent sx={{ p: 3.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#003366', mb: 2.5 }}>
                      Section 4: Entry Fee Structure / రుసుము
                    </Typography>
                    
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} sm={8}>
                        <TextField 
                          fullWidth 
                          type="number" 
                          label="Tournament Entry Fee" 
                          {...register('entryFee')} 
                          error={!!errors.entryFee} 
                          helperText={errors.entryFee?.message} 
                          size="small"
                          slotProps={{
                            input: {
                              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                              endAdornment: <InputAdornment position="end">INR</InputAdornment>
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* SECTION 5: Official Documents */}
                <Card sx={{ borderTop: '4px solid #003366', borderRadius: '4px' }}>
                  <CardContent sx={{ p: 3.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#003366', mb: 1.5 }}>
                      Section 5: Official Circular & Rulebooks / పత్రాలు
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2.5 }}>
                      Upload brochure guidelines, circular schedules, and official selection documentation. (PDF, DOC, DOCX up to 10MB)
                    </Typography>
                    
                    <Grid container spacing={3}>
                      {/* Brochure */}
                      <Grid item xs={12} sm={4}>
                        <Button 
                          variant="outlined" 
                          component="label" 
                          fullWidth 
                          startIcon={<UploadFileIcon />}
                          sx={{ borderStyle: 'dashed', py: 1.5, borderColor: brochureFile ? 'success.main' : 'primary.main' }}
                        >
                          Brochure PDF
                          <input type="file" hidden accept=".pdf,.doc,.docx" onChange={(e) => setBrochureFile(e.target.files[0])} />
                        </Button>
                        {brochureFile && (
                          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1, justifyContent: 'center' }}>
                            <CheckCircleIcon color="success" sx={{ fontSize: 14 }} />
                            <Typography variant="caption" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
                              {brochureFile.name}
                            </Typography>
                          </Stack>
                        )}
                      </Grid>

                      {/* Guidelines */}
                      <Grid item xs={12} sm={4}>
                        <Button 
                          variant="outlined" 
                          component="label" 
                          fullWidth 
                          startIcon={<UploadFileIcon />}
                          sx={{ borderStyle: 'dashed', py: 1.5, borderColor: guidelinesFile ? 'success.main' : 'primary.main' }}
                        >
                          Guidelines Doc
                          <input type="file" hidden accept=".pdf,.doc,.docx" onChange={(e) => setGuidelinesFile(e.target.files[0])} />
                        </Button>
                        {guidelinesFile && (
                          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1, justifyContent: 'center' }}>
                            <CheckCircleIcon color="success" sx={{ fontSize: 14 }} />
                            <Typography variant="caption" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
                              {guidelinesFile.name}
                            </Typography>
                          </Stack>
                        )}
                      </Grid>

                      {/* Rule Book */}
                      <Grid item xs={12} sm={4}>
                        <Button 
                          variant="outlined" 
                          component="label" 
                          fullWidth 
                          startIcon={<UploadFileIcon />}
                          sx={{ borderStyle: 'dashed', py: 1.5, borderColor: ruleBookFile ? 'success.main' : 'primary.main' }}
                        >
                          Rule Book PDF
                          <input type="file" hidden accept=".pdf,.doc,.docx" onChange={(e) => setRuleBookFile(e.target.files[0])} />
                        </Button>
                        {ruleBookFile && (
                          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1, justifyContent: 'center' }}>
                            <CheckCircleIcon color="success" sx={{ fontSize: 14 }} />
                            <Typography variant="caption" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
                              {ruleBookFile.name}
                            </Typography>
                          </Stack>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>

            {/* RIGHT COLUMN: Section 6 & 7 (4.5 columns width - sticky preview & actions) */}
            <Grid item xs={12} lg={4.5}>
              <Stack spacing={3} sx={{ position: 'sticky', top: 24 }}>
                
                {/* SECTION 6: Live Circular Preview */}
                <Card sx={{ border: '1px solid #D1D9E0', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', bgcolor: '#ffffff' }}>
                  <Box sx={{ bgcolor: '#003366', color: '#ffffff', py: 1.5, px: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: '0.5px' }}>
                      Section 6: Live Circular Preview
                    </Typography>
                    <Chip 
                      label={watchAllFields.status || 'PUBLISHED'} 
                      size="small" 
                      color={watchAllFields.status === 'PUBLISHED' ? 'success' : 'warning'} 
                      sx={{ fontWeight: 700, borderRadius: '4px', fontSize: '0.65rem' }} 
                    />
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Paper variant="outlined" sx={{ p: 2.5, bgcolor: '#FAFBFD', border: '1px solid #E2E8F0', borderRadius: '4px' }}>
                      <Box sx={{ textAlignment: 'center', mb: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#B37400', letterSpacing: '1px', display: 'block' }}>
                          ANDHRA PRADESH TENNIKOIT ASSOCIATION
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 900, color: '#003366', fontFamily: "'Noto Serif', Georgia, serif", mt: 0.5, lineHeight: 1.25 }}>
                          {watchAllFields.title || 'Official Championship Title'}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 1.5, borderColor: '#D1D9E0' }} />

                      <Stack spacing={1.5}>
                        <Stack direction="row" spacing={1.2} alignItems="flex-start">
                          <LocationOnIcon sx={{ color: '#0057A8', fontSize: 18, mt: 0.2 }} />
                          <Box>
                            <Typography variant="caption" color="text.disabled" display="block">VENUE / వేదిక</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>
                              {watchAllFields.venue || 'Declared Stadium / Location'}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack direction="row" spacing={1.2} alignItems="flex-start">
                          <CalendarMonthIcon sx={{ color: '#0057A8', fontSize: 18, mt: 0.2 }} />
                          <Box>
                            <Typography variant="caption" color="text.disabled" display="block">SCHEDULED TIMEFRAME</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>
                              {watchAllFields.startDate ? dayjs(watchAllFields.startDate).format('MMMM DD, YYYY') : 'Start Date'} to {watchAllFields.endDate ? dayjs(watchAllFields.endDate).format('MMMM DD, YYYY') : 'End Date'}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack direction="row" spacing={1.2} alignItems="flex-start">
                          <InfoIcon sx={{ color: '#FF6600', fontSize: 18, mt: 0.2 }} />
                          <Box>
                            <Typography variant="caption" color="text.disabled" display="block">REGISTRATION DEADLINE</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#C0392B' }}>
                              {watchAllFields.registrationDeadline ? dayjs(watchAllFields.registrationDeadline).format('MMMM DD, YYYY hh:mm A') : 'Pending Declaration'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Stack>

                      <Divider sx={{ my: 2, borderColor: '#D1D9E0' }} />

                      <Typography variant="caption" color="text.disabled" display="block" sx={{ mb: 1 }}>
                        APPROVED AGE CATEGORIES
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }} useFlexGap>
                        {selectedCats.SUB_JUNIOR && <Chip label="Sub-Junior" size="small" sx={{ borderRadius: '4px', fontWeight: 700 }} />}
                        {selectedCats.JUNIOR && <Chip label="Junior" size="small" sx={{ borderRadius: '4px', fontWeight: 700 }} />}
                        {selectedCats.SENIOR && <Chip label="Senior" size="small" sx={{ borderRadius: '4px', fontWeight: 700 }} />}
                        {selectedCats.OPEN && <Chip label="Open" size="small" sx={{ borderRadius: '4px', fontWeight: 700 }} />}
                        {!selectedCats.SUB_JUNIOR && !selectedCats.JUNIOR && !selectedCats.SENIOR && !selectedCats.OPEN && (
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>No divisions selected</Typography>
                        )}
                      </Stack>

                      <Divider sx={{ my: 2, borderColor: '#D1D9E0' }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.disabled">REGISTRATION ENTRY FEE</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0057A8' }}>
                          {watchAllFields.entryFee ? `${watchAllFields.entryFee} INR` : 'Free Entry'}
                        </Typography>
                      </Box>
                    </Paper>
                  </CardContent>
                </Card>

                {/* SECTION 7: Actions */}
                <Card sx={{ border: '1px solid #D1D9E0', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#003366', mb: 2 }}>
                      Section 7: Actions / చర్యలు
                    </Typography>
                    
                    <Stack spacing={2}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={uploading} 
                        sx={{ bgcolor: '#0057A8', fontWeight: 700, py: 1.5 }}
                      >
                        {uploading ? <CircularProgress size={20} color="inherit" /> : 'Publish & Broadcast Circular'}
                      </Button>
                      
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        onClick={() => navigate('/admin/tournaments')}
                        sx={{ py: 1.2 }}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>

              </Stack>
            </Grid>

          </Grid>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
