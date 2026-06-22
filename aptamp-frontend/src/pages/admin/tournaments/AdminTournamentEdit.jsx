import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Box, Card, CardContent, Typography, TextField, MenuItem, Button, Stack, FormControlLabel, Checkbox, Divider,  } from '@mui/material';
import Grid from '@mui/material/Grid';;

import PageTitle from '../../../components/common/PageTitle';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { getTournamentById } from '../../../api/tournament.api';
import { updateTournament } from '../../../api/admin.api';
import { uploadFile } from '../../../api/player.api';
import { CircularProgress } from '@mui/material';

const editSchema = yup.object().shape({
  title: yup.string().required('Tournament title is required'),
  description: yup.string().required('Description is required'),
  venue: yup.string().required('Venue is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().required('End date is required'),
  registrationDeadline: yup.string().required('Registration deadline is required'),
  entryFee: yup.number().typeError('Must be a number').min(0).required('Entry fee is required'),
  status: yup.string().required('Status is required'),
});

const statusOptions = [
  { value: 'DRAFT',     label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'COMPLETED', label: 'Completed' },
];

export default function AdminTournamentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCats, setSelectedCats] = useState({
    SUB_JUNIOR: false,
    JUNIOR: false,
    SENIOR: false,
    OPEN: false,
  });

  const [brochureFile, setBrochureFile] = useState(null);
  const [guidelinesFile, setGuidelinesFile] = useState(null);
  const [ruleBookFile, setRuleBookFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { data: tournament, isLoading } = useQuery({
    key: ['adminEditTournamentDetail', id],
    queryFn: () => getTournamentById(id),
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(editSchema),
  });

  useEffect(() => {
    if (tournament) {
      setValue('title', tournament.title || '');
      setValue('description', tournament.description || '');
      setValue('venue', tournament.venue || '');
      setValue('startDate', tournament.startDate || '');
      setValue('endDate', tournament.endDate || '');
      setValue('entryFee', tournament.entryFee || 0);
      setValue('status', tournament.status || 'PUBLISHED');

      if (tournament.registrationDeadline) {
        const localDeadline = new Date(tournament.registrationDeadline).toISOString().slice(0, 16);
        setValue('registrationDeadline', localDeadline);
      }

      // Prepopulate selected categories
      const initialCats = { SUB_JUNIOR: false, JUNIOR: false, SENIOR: false, OPEN: false };
      tournament.categories?.forEach((c) => {
        const nameUpper = c.categoryName.toUpperCase();
        if (nameUpper.includes('SUB_JUNIOR') || nameUpper.includes('SUB-JUNIOR')) initialCats.SUB_JUNIOR = true;
        else if (nameUpper.includes('JUNIOR')) initialCats.JUNIOR = true;
        else if (nameUpper.includes('SENIOR')) initialCats.SENIOR = true;
        else if (nameUpper.includes('OPEN')) initialCats.OPEN = true;
      });
      setSelectedCats(initialCats);
    }
  }, [tournament, setValue]);

  const handleCatChange = (e) => {
    setSelectedCats({
      ...selectedCats,
      [e.target.name]: e.target.checked,
    });
  };

  const onSubmit = async (data) => {
    const categoriesList = Object.keys(selectedCats)
      .filter((key) => selectedCats[key])
      .map((key) => ({
        categoryName: key === 'SUB_JUNIOR' ? 'Sub-Junior' : key === 'JUNIOR' ? 'Junior' : key === 'SENIOR' ? 'Senior' : 'Open',
        gender: 'ANY',
        minAge: key === 'SUB_JUNIOR' ? 8 : key === 'JUNIOR' ? 14 : key === 'SENIOR' ? 18 : 0,
        maxAge: key === 'SUB_JUNIOR' ? 14 : key === 'JUNIOR' ? 18 : key === 'SENIOR' ? 35 : 99,
      }));

    if (categoriesList.length === 0) {
      toast.error('Please select at least one category.');
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

      await updateTournament(id, {
        ...data,
        registrationDeadline: new Date(data.registrationDeadline).toISOString(),
        categories: categoriesList,
        documents: documentsList,
      });
      toast.success('Tournament saved successfully');
      queryClient.invalidateQueries(['adminTournamentsList']);
      navigate('/admin/tournaments');
    } catch (e) {
      const msg = e.response?.data?.message || 'Failed to update tournament.';
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return <LoadingSpinner message="Fetching Tournament Info..." />;

  return (
    <Box>
      <PageTitle title="Modify Tournament Parameters / పోటీ సవరణ" subtitle="Modify venue selections, registration deadlines, and division parameters" />

      <Card sx={{ borderTop: '3.5px solid #0057A8' }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              <Grid  item xs={12}>
                <TextField fullWidth label="Tournament Title" {...register('title')} error={!!errors.title} helperText={errors.title?.message} size="small" />
              </Grid>

              <Grid  item xs={12}>
                <TextField fullWidth multiline rows={3} label="Description & Guidelines" {...register('description')} error={!!errors.description} helperText={errors.description?.message} />
              </Grid>

              <Grid  item xs={12} sm={6}>
                <TextField fullWidth label="Venue Location" {...register('venue')} error={!!errors.venue} helperText={errors.venue?.message} size="small" />
              </Grid>

              <Grid  item xs={12} sm={6}>
                <TextField select fullWidth label="Status" {...register('status')} error={!!errors.status} helperText={errors.status?.message} size="small">
                  {statusOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid  item xs={12} sm={4}>
                <TextField fullWidth type="date" label="Start Date" slotProps={{ inputLabel: { shrink: true } }} {...register('startDate')} error={!!errors.startDate} helperText={errors.startDate?.message} size="small" />
              </Grid>

              <Grid  item xs={12} sm={4}>
                <TextField fullWidth type="date" label="End Date" slotProps={{ inputLabel: { shrink: true } }} {...register('endDate')} error={!!errors.endDate} helperText={errors.endDate?.message} size="small" />
              </Grid>

              <Grid  item xs={12} sm={4}>
                <TextField fullWidth type="datetime-local" label="Registration Deadline" slotProps={{ inputLabel: { shrink: true } }} {...register('registrationDeadline')} error={!!errors.registrationDeadline} helperText={errors.registrationDeadline?.message} size="small" />
              </Grid>

              <Grid  item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Entry Fee (INR)" {...register('entryFee')} error={!!errors.entryFee} helperText={errors.entryFee?.message} size="small" />
              </Grid>

              <Grid  item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.secondary' }}>
                  Division Categories
                </Typography>
                <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
                  <FormControlLabel control={<Checkbox checked={selectedCats.SUB_JUNIOR} onChange={handleCatChange} name="SUB_JUNIOR" />} label="Sub-Junior" />
                  <FormControlLabel control={<Checkbox checked={selectedCats.JUNIOR} onChange={handleCatChange} name="JUNIOR" />} label="Junior" />
                  <FormControlLabel control={<Checkbox checked={selectedCats.SENIOR} onChange={handleCatChange} name="SENIOR" />} label="Senior" />
                  <FormControlLabel control={<Checkbox checked={selectedCats.OPEN} onChange={handleCatChange} name="OPEN" />} label="Open" />
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#003366', mb: 2 }}>
                  Official Documents / Tournament Guidelines (PDF, DOC, DOCX)
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Button variant="outlined" component="label" fullWidth sx={{ borderStyle: 'dashed' }}>
                      Upload Tournament Brochure
                      <input type="file" hidden accept=".pdf,.doc,.docx" onChange={(e) => setBrochureFile(e.target.files[0])} />
                    </Button>
                    {brochureFile && (
                      <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center', fontWeight: 600 }}>
                        Selected: {brochureFile.name}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button variant="outlined" component="label" fullWidth sx={{ borderStyle: 'dashed' }}>
                      Upload Guidelines Document
                      <input type="file" hidden accept=".pdf,.doc,.docx" onChange={(e) => setGuidelinesFile(e.target.files[0])} />
                    </Button>
                    {guidelinesFile && (
                      <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center', fontWeight: 600 }}>
                        Selected: {guidelinesFile.name}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button variant="outlined" component="label" fullWidth sx={{ borderStyle: 'dashed' }}>
                      Upload Rule Book
                      <input type="file" hidden accept=".pdf,.doc,.docx" onChange={(e) => setRuleBookFile(e.target.files[0])} />
                    </Button>
                    {ruleBookFile && (
                      <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center', fontWeight: 600 }}>
                        Selected: {ruleBookFile.name}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate('/admin/tournaments')}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={uploading} sx={{ bgcolor: '#0057A8', fontWeight: 700 }}>
                {uploading ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
