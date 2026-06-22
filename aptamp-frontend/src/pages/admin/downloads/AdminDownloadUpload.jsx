import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography, TextField, MenuItem, Button, Stack, Divider, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';;

import PageTitle from '../../../components/common/PageTitle';
import { uploadFile } from '../../../api/player.api';
import { createDownload } from '../../../api/download.api';

const downloadSchema = yup.object().shape({
  name: yup.string().required('Document Name is required'),
  description: yup.string().required('Description is required'),
  category: yup.string().required('Category selection is required'),
});

export default function AdminDownloadUpload() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [docFile, setDocFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(downloadSchema),
    defaultValues: {
      category: 'RULES',
    }
  });

  const handleFileChange = (e) => {
    setDocFile(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    if (!docFile) {
      toast.error('Please choose a document to upload.');
      return;
    }

    setUploading(true);
    try {
      // 1. Upload file using file controller
      const uploadedUrl = await uploadFile(docFile, 'tournaments');
      const objectName = uploadedUrl.split('objectName=').pop();

      // 2. Submit document parameters to downloads database
      await createDownload({
        name: data.name,
        description: data.description,
        category: data.category,
        objectName,
        type: docFile.name.split('.').pop().toUpperCase(),
        size: (docFile.size / (1024 * 1024)).toFixed(1) + ' MB',
      });

      toast.success('File uploaded successfully');
      queryClient.invalidateQueries(['adminDownloadsList']);
      queryClient.invalidateQueries(['publicDownloads']);
      queryClient.invalidateQueries(['playerDownloadsList']);
      navigate('/admin/downloads');
    } catch (e) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <PageTitle title="Upload Official Circular / ఫైలు అప్‌లోడ్" subtitle="Upload rule playbooks, match brackets spreadsheets, or selection guidelines" />

      <Card sx={{ borderTop: '3.5px solid #0057A8' }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              <Grid  item xs={12} sm={6}>
                <TextField fullWidth label="Document Name" {...register('name')} error={!!errors.name} helperText={errors.name?.message} size="small" />
              </Grid>

              <Grid  item xs={12} sm={6}>
                <TextField select fullWidth label="Document Category" defaultValue="RULES" {...register('category')} error={!!errors.category} helperText={errors.category?.message} size="small">
                  <MenuItem value="RULES">Rules & Regulations</MenuItem>
                  <MenuItem value="CIRCULARS">Official Circulars</MenuItem>
                  <MenuItem value="BRACKETS">Match Brackets</MenuItem>
                </TextField>
              </Grid>

              <Grid  item xs={12}>
                <TextField fullWidth multiline rows={2} label="Document Description" {...register('description')} error={!!errors.description} helperText={errors.description?.message} />
              </Grid>

              <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }} item xs={12}>
                <Button variant="outlined" component="label">
                  Choose Document File (PDF / Word)
                  <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                </Button>
                {docFile && (
                  <Typography variant="caption" color="text.secondary">
                    Selected: {docFile.name} ({(docFile.size / 1024).toFixed(1)} KB)
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate('/admin/downloads')}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={uploading} sx={{ bgcolor: '#0057A8', fontWeight: 700 }}>
                {uploading ? <CircularProgress size={20} color="inherit" /> : 'Confirm Upload'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
