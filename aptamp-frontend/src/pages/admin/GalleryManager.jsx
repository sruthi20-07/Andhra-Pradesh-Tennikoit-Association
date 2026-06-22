import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Typography, Box, Card, CardContent, Button, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Grid from '@mui/material/Grid';;
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import galleryService from '../../services/galleryService';
import fileService from '../../services/fileService';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';

export default function GalleryManager() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('IMAGE');
  const [file, setFile] = useState(null);

  // Fetch gallery items
  const { data: items, isLoading } = useQuery({
    queryKey: ['adminGallery'],
    queryFn: () => galleryService.getItems()
  });

  // Create items mutation
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post('/gallery', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGallery'] });
      setOpen(false);
      setTitle('');
      setType('IMAGE');
      setFile(null);
      alert('Gallery uploaded successfully.');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to upload gallery item.');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGallery'] });
      alert('Gallery deleted.');
    }
  });

  const handleUpload = async () => {
    if (!title || !file) {
      alert('Please fill all fields');
      return;
    }

    try {
      // Direct presigned upload to MinIO
      const { url, objectName } = await fileService.getUploadUrl(file.name, file.type, 'gallery');
      await fileService.uploadFileViaPresignedUrl(url, file);

      createMutation.mutate({
        title,
        type,
        url: objectName
      });
    } catch (err) {
      console.error(err);
      alert('Failed to upload file.');
    }
  };

  if (isLoading) {
    return <Loader message="Loading gallery assets..." />;
  }

  const list = items || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Manage Association Gallery
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Add Media Asset
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>File Key / URL</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  No media assets uploaded yet.
                </TableCell>
              </TableRow>
            ) : (
              list.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{item.title}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.url}</TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => deleteMutation.mutate(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Add Gallery Item</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Asset Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              fullWidth
              select
              label="Asset Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="IMAGE">Photo Image</MenuItem>
              <MenuItem value="VIDEO">Video Clip</MenuItem>
            </TextField>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Select Media File
            </Typography>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            color="primary"
            disabled={createMutation.isPending}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
