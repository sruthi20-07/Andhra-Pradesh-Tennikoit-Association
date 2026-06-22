import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Button, IconButton, Rating, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, CircularProgress, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import BlockIcon from '@mui/icons-material/Block';
import toast from 'react-hot-toast';

import PageTitle from '../../../components/common/PageTitle';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import { getFeedbacks, deleteFeedback, updateFeedbackStatus } from '../../../api/admin.api';

export default function FeedbackManager() {
  const queryClient = useQueryClient();
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);

  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ['adminFeedbacksList'],
    queryFn: getFeedbacks
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await deleteFeedback(id);
        toast.success('Feedback deleted successfully');
        queryClient.invalidateQueries(['adminFeedbacksList']);
        queryClient.invalidateQueries(['adminFeedbacksDashboard']);
      } catch (e) {
        toast.error('Failed to delete feedback');
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateFeedbackStatus(id, { status: 'APPROVED', reply: 'Approved by admin' });
      toast.success('Feedback approved successfully');
      queryClient.invalidateQueries(['adminFeedbacksList']);
      queryClient.invalidateQueries(['adminFeedbacksDashboard']);
    } catch (e) {
      toast.error('Failed to approve feedback');
    }
  };

  const handleReject = async (id) => {
    try {
      await updateFeedbackStatus(id, { status: 'REJECTED', reply: 'Rejected by admin' });
      toast.success('Feedback rejected successfully');
      queryClient.invalidateQueries(['adminFeedbacksList']);
      queryClient.invalidateQueries(['adminFeedbacksDashboard']);
    } catch (e) {
      toast.error('Failed to reject feedback');
    }
  };

  const handleSaveReply = async (status) => {
    if (!selectedFeedback) return;
    setSaving(true);
    try {
      await updateFeedbackStatus(selectedFeedback.id, {
        status,
        reply: replyText || (status === 'APPROVED' ? 'Approved' : 'Rejected')
      });
      toast.success(`Feedback ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully`);
      setSelectedFeedback(null);
      setReplyText('');
      queryClient.invalidateQueries(['adminFeedbacksList']);
      queryClient.invalidateQueries(['adminFeedbacksDashboard']);
    } catch (e) {
      toast.error('Failed to update feedback status');
    } finally {
      setSaving(false);
    }
  };

  const handleViewClick = (fb) => {
    setSelectedFeedback(fb);
    setReplyText(fb.adminReply || '');
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 180 },
    { 
      field: 'rating', 
      headerName: 'Rating', 
      width: 130,
      renderCell: ({ row }) => <Rating value={row.rating || 0} readOnly size="small" />
    },
    { field: 'subject', headerName: 'Subject', width: 200 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      renderCell: ({ row }) => <StatusBadge status={row.status} />
    },
    { field: 'message', headerName: 'Message', width: 250, renderCell: ({ row }) => row.message ? (row.message.length > 40 ? row.message.substring(0, 40) + '...' : row.message) : '' },
    { 
      field: 'createdAt', 
      headerName: 'Date', 
      width: 130, 
      renderCell: ({ row }) => {
        if (!row.createdAt) return '';
        try {
          return new Date(row.createdAt).toLocaleDateString();
        } catch (e) {
          return '';
        }
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton color="primary" onClick={() => handleViewClick(row)} title="View Feedback">
            <ViewIcon />
          </IconButton>
          {row.status === 'NEW' && (
            <>
              <IconButton color="success" onClick={() => handleApprove(row.id)} title="Approve Feedback">
                <CheckIcon />
              </IconButton>
              <IconButton color="warning" onClick={() => handleReject(row.id)} title="Reject Feedback">
                <BlockIcon />
              </IconButton>
            </>
          )}
          <IconButton color="error" onClick={() => handleDelete(row.id)} title="Delete Feedback">
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <PageTitle title="Feedback Management" subtitle="Review feedback submitted by verified players" />

      <DataTable
        columns={columns}
        rows={feedbacks}
        loading={isLoading}
        searchPlaceholder="Search feedback..."
        exportFilename="player_feedback.csv"
      />

      {/* View Feedback Dialog */}
      <Dialog
        open={Boolean(selectedFeedback)}
        onClose={() => !saving && setSelectedFeedback(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700, bgcolor: '#003366', color: '#ffffff' }}>
          Feedback from {selectedFeedback?.name}
        </DialogTitle>
        <DialogContent sx={{ p: 4, mt: 2 }}>
          <DialogContentText component="div" sx={{ color: '#333333' }}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <strong>Rating:</strong>
                <Rating value={selectedFeedback?.rating || 0} readOnly size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <strong>Email Address:</strong> {selectedFeedback?.email}
              </Grid>
              <Grid item xs={12} sm={6}>
                <strong>Submitted Date:</strong> {selectedFeedback?.createdAt ? new Date(selectedFeedback.createdAt).toLocaleString() : ''}
              </Grid>
              <Grid item xs={12} sm={6}>
                <strong>Status:</strong> <StatusBadge status={selectedFeedback?.status} />
              </Grid>
              <Grid item xs={12}>
                <strong>Subject:</strong> {selectedFeedback?.subject}
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, p: 2, bgcolor: '#f4f6f8', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
              <strong>Message Content:</strong>
              <p style={{ marginTop: '8px', lineHeight: 1.6 }}>{selectedFeedback?.message}</p>
            </Box>

            {selectedFeedback?.adminReply && (
              <Box sx={{ mt: 3, p: 2, bgcolor: '#eef9ff', borderLeft: '4px solid #0057A8', borderRadius: '4px' }}>
                <strong>Admin Reply:</strong>
                <p style={{ marginTop: '8px', lineHeight: 1.6 }}>{selectedFeedback.adminReply}</p>
              </Box>
            )}

            {selectedFeedback?.status === 'NEW' && (
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Add Admin Reply (Optional)"
                  multiline
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={saving}
                  placeholder="Enter comments/replies here before approving or rejecting..."
                />
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setSelectedFeedback(null)} disabled={saving}>
            Cancel
          </Button>
          {selectedFeedback?.status === 'NEW' ? (
            <Stack direction="row" spacing={1}>
              <Button
                onClick={() => handleSaveReply('REJECTED')}
                variant="contained"
                disabled={saving}
                color="error"
              >
                Reject
              </Button>
              <Button
                onClick={() => handleSaveReply('APPROVED')}
                variant="contained"
                disabled={saving}
                color="success"
              >
                Approve
              </Button>
            </Stack>
          ) : (
            <Button onClick={() => setSelectedFeedback(null)} variant="contained" sx={{ bgcolor: '#003366' }}>
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
