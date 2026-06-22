import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Card, CardContent, CardMedia, Typography, Button, Stack, IconButton, Skeleton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import toast from 'react-hot-toast';

import PageTitle from '../../../components/common/PageTitle';
import { getGalleryItems, deleteGalleryItem, updateGalleryItem } from '../../../api/gallery.api';
import { uploadFile } from '../../../api/player.api';

export default function AdminGalleryList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: itemsRaw = [], isLoading } = useQuery({
    queryKey: ['adminGalleryList'],
    queryFn: () => getGalleryItems(),
  });

  const items = Array.isArray(itemsRaw) ? itemsRaw : (itemsRaw?.content || itemsRaw?.data || []);

  // Edit states
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editType, setEditType] = useState('IMAGE');
  const [editUrl, setEditUrl] = useState('');
  const [editFile, setEditFile] = useState(null);
  const [editFilePreview, setEditFilePreview] = useState(null);
  const [updating, setUpdating] = useState(false);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setEditTitle(item.title || '');
    setEditDescription(item.description || '');
    setEditType(item.type || 'IMAGE');
    setEditUrl(item.url || '');
    setEditFile(null);
    setEditFilePreview(null);
    setEditOpen(true);
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFile(file);
      setEditFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      toast.error('Title is required');
      return;
    }
    setUpdating(true);
    try {
      let finalUrl = editUrl;
      if (editFile) {
        finalUrl = await uploadFile(editFile, 'gallery');
      }

      await updateGalleryItem(selectedItem.id, {
        title: editTitle,
        description: editDescription,
        type: editType,
        url: finalUrl,
        galleryType: 'GENERAL'
      });

      toast.success('Media updated successfully');
      setEditOpen(false);
      queryClient.invalidateQueries(['adminGalleryList']);
      queryClient.invalidateQueries(['publicGallery']);
      queryClient.invalidateQueries(['playerGallery']);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this from the gallery?')) return;
    try {
      await deleteGalleryItem(id);
      toast.success('Media deleted successfully');
      queryClient.invalidateQueries(['adminGalleryList']);
      queryClient.invalidateQueries(['publicGallery']);
      queryClient.invalidateQueries(['playerGallery']);
    } catch (err) {
      toast.error('Deletion failed.');
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <PageTitle title="Gallery Management / గ్యాలరీ మేనేజ్‌మెంట్" subtitle="Upload pictures, publish video highlights, and edit tennikoit brackets portfolios" />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/gallery/upload')}
          sx={{ height: 40, bgcolor: '#0057A8' }}
        >
          Upload Media
        </Button>
      </Stack>

      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((n) => (
            <Grid key={n} item xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" height={220} />
            </Grid>
          ))}
        </Grid>
      ) : items.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#F5F7FA' }}>
          <Typography variant="body2" color="text.secondary">No items found.</Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid key={item.id} item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {item.type === 'VIDEO' ? (
                  item.url && (item.url.includes('youtube.com') || item.url.includes('youtu.be')) ? (
                    <Box component="iframe" src={item.url.replace('watch?v=', 'embed/')} sx={{ width: '100%', height: 180, border: 'none' }} />
                  ) : (
                    <Box component="video" src={item.url} controls sx={{ width: '100%', height: 180, objectFit: 'cover' }} />
                  )
                ) : (
                  <CardMedia component="img" height="180" image={item.url} alt={item.title} />
                )}
                <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700, color: '#003366' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.type}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                    <IconButton size="small" color="primary" onClick={() => handleEditClick(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => !updating && setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#003366' }}>Edit Gallery Item</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              disabled={updating}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <FormControl fullWidth>
              <InputLabel shrink id="edit-media-type-label">Media Type</InputLabel>
              <Select
                labelId="edit-media-type-label"
                label="Media Type"
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
                disabled={updating}
                notched
              >
                <MenuItem value="IMAGE">Image / Photo</MenuItem>
                <MenuItem value="VIDEO">Video / Clip</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              disabled={updating}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Media File</Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                {(editFilePreview || editUrl) && (
                  <Box sx={{ width: 100, height: 100, border: '1px solid #D1D9E0', borderRadius: '4px', overflow: 'hidden' }}>
                    {editType === 'VIDEO' && !editFilePreview && editUrl && !(editUrl.includes('youtube.com') || editUrl.includes('youtu.be')) ? (
                      <video src={editUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : editType === 'VIDEO' && editFilePreview ? (
                      <video src={editFilePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <img src={editFilePreview || editUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </Box>
                )}
                <Button variant="outlined" component="label" disabled={updating}>
                  Choose New File
                  <input type="file" hidden accept="image/*,video/*" onChange={handleEditFileChange} />
                </Button>
              </Stack>
              {editFile && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  New file selected: {editFile.name}
                </Typography>
              )}
            </Box>

            <TextField
              fullWidth
              label="Or Media URL (YouTube/Direct link)"
              value={editUrl}
              onChange={(e) => {
                setEditUrl(e.target.value);
                setEditFile(null);
                setEditFilePreview(null);
              }}
              disabled={updating}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={updating}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit} disabled={updating} sx={{ bgcolor: '#0057A8', fontWeight: 700 }}>
            {updating ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
