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
import { createGalleryItem } from '../../../api/gallery.api';

const uploadSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().optional(),
  type: yup.string().required('Media type is required'),
});

export default function AdminGalleryUpload() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mediaFile, setMediaFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(uploadSchema),
    defaultValues: {
      type: 'IMAGE',
    }
  });

  const selectedType = watch('type');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setPreview(URL.createObjectURL(file));
      setVideoUrl(''); // Reset url if they selected a file
    }
  };

  const onSubmit = async (data) => {
    if (!mediaFile && !videoUrl.trim()) {
      toast.error('Please choose a file to upload or enter a URL.');
      return;
    }

    setUploading(true);
    try {
      let finalUrl = videoUrl.trim();
      
      // 1. Upload photo/video if file is selected
      if (mediaFile) {
        finalUrl = await uploadFile(mediaFile, 'gallery');
      }

      // 2. Submit gallery creation payload
      await createGalleryItem({
        title: data.title,
        description: data.description || '',
        type: data.type,
        url: finalUrl,
        galleryType: 'GENERAL',
      });

      toast.success('Media uploaded successfully');
      queryClient.invalidateQueries(['adminGalleryList']);
      queryClient.invalidateQueries(['publicGallery']);
      queryClient.invalidateQueries(['playerGallery']);
      navigate('/admin/gallery');
    } catch (e) {
      const msg = e.response?.data?.message || 'Upload failed. Please try again.';
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <PageTitle title="Upload Gallery Media / మీడియా అప్‌లోడ్" subtitle="Publish action photos or embed video highlights" />

      <Card sx={{ borderTop: '3.5px solid #0057A8' }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Media Title" {...register('title')} error={!!errors.title} helperText={errors.title?.message} size="small" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Media Type" defaultValue="IMAGE" {...register('type')} error={!!errors.type} helperText={errors.type?.message} size="small">
                  <MenuItem value="IMAGE">Image / Photo</MenuItem>
                  <MenuItem value="VIDEO">Video / Clip</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth multiline rows={2} label="Description" {...register('description')} error={!!errors.description} helperText={errors.description?.message} />
              </Grid>

              <Grid sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} item xs={12}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Option 1: Upload a File</Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {preview && (
                      <Box sx={{ width: 120, height: 120, border: '1px solid #D1D9E0', borderRadius: '4px', overflow: 'hidden' }}>
                        {selectedType === 'VIDEO' || (mediaFile && mediaFile.type.startsWith('video')) ? (
                          <video src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </Box>
                    )}
                    <Button variant="outlined" component="label" disabled={uploading}>
                      Choose Media File
                      <input type="file" hidden accept="image/*,video/*" onChange={handleFileChange} />
                    </Button>
                  </Stack>
                  {mediaFile && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Selected file: {mediaFile.name}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Option 2: Or Paste Media URL</Typography>
                  <TextField 
                    fullWidth 
                    label="Media URL (e.g. YouTube or video link)" 
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      setMediaFile(null); // Clear selected file if they type a URL
                      setPreview(null);
                    }}
                    disabled={uploading}
                    size="small" 
                  />
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate('/admin/gallery')} disabled={uploading}>Cancel</Button>
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
