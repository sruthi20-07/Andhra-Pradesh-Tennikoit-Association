import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import toast from 'react-hot-toast';

import PageTitle from '../../../components/common/PageTitle';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import { getContactMessages, deleteContactMessage, updateContactQuery } from '../../../api/admin.api';

export default function ContactQueriesManager() {
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['adminContactMessagesList', searchQuery],
    queryFn: () => getContactMessages(searchQuery)
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact message?')) {
      try {
        await deleteContactMessage(id);
        toast.success('Contact query deleted successfully');
        queryClient.invalidateQueries(['adminContactMessagesList']);
        queryClient.invalidateQueries(['adminContactsDashboard']);
      } catch (e) {
        toast.error('Failed to delete query');
      }
    }
  };

  const handleResolve = async (id) => {
    try {
      await updateContactQuery(id, { status: 'RESOLVED', reply: 'Marked resolved by admin' });
      toast.success('Query resolved successfully');
      queryClient.invalidateQueries(['adminContactMessagesList']);
      queryClient.invalidateQueries(['adminContactsDashboard']);
    } catch (e) {
      toast.error('Failed to resolve query');
    }
  };

  const handleSubmitReply = async () => {
    if (!selectedMessage) return;
    setSaving(true);
    try {
      await updateContactQuery(selectedMessage.id, {
        status: 'RESOLVED',
        reply: replyText || 'Resolved'
      });
      toast.success('Query resolved successfully');
      setSelectedMessage(null);
      setReplyText('');
      queryClient.invalidateQueries(['adminContactMessagesList']);
      queryClient.invalidateQueries(['adminContactsDashboard']);
    } catch (e) {
      toast.error('Failed to save reply');
    } finally {
      setSaving(false);
    }
  };

  const handleViewClick = (msg) => {
    setSelectedMessage(msg);
    setReplyText(msg.adminReply || '');
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'subject', headerName: 'Subject', width: 220 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      renderCell: ({ row }) => <StatusBadge status={row.status} />
    },
    { 
      field: 'createdAt', 
      headerName: 'Date', 
      width: 150, 
      renderCell: ({ row }) => {
        if (!row.createdAt) return '';
        try {
          return new Date(row.createdAt).toLocaleString();
        } catch (e) {
          return '';
        }
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton color="primary" onClick={() => handleViewClick(row)} title="View Message">
            <ViewIcon />
          </IconButton>
          {row.status !== 'RESOLVED' && (
            <IconButton color="success" onClick={() => handleResolve(row.id)} title="Mark Resolved">
              <CheckIcon />
            </IconButton>
          )}
          <IconButton color="error" onClick={() => handleDelete(row.id)} title="Delete Message">
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <PageTitle title="Contact Queries" subtitle="View and manage messages received from the public contact form" />

      <DataTable
        columns={columns}
        rows={messages}
        loading={isLoading}
        searchPlaceholder="Search by name, email, subject or message content..."
        exportFilename="contact_messages.csv"
      />

      {/* View Message Dialog */}
      <Dialog
        open={Boolean(selectedMessage)}
        onClose={() => !saving && setSelectedMessage(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontWeight: 700, bgcolor: '#003366', color: '#ffffff' }}>
          Query Details: {selectedMessage?.subject}
        </DialogTitle>
        <DialogContent sx={{ p: 4, mt: 2 }}>
          <DialogContentText component="div" sx={{ color: '#333333' }}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <strong>From Name:</strong> {selectedMessage?.name}
              </Grid>
              <Grid item xs={12} sm={6}>
                <strong>Email Address:</strong> {selectedMessage?.email}
              </Grid>
              <Grid item xs={12} sm={6}>
                <strong>Phone Number:</strong> {selectedMessage?.phone || 'N/A'}
              </Grid>
              <Grid item xs={12} sm={6}>
                <strong>Received At:</strong> {selectedMessage?.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : ''}
              </Grid>
              <Grid item xs={12} sm={6}>
                <strong>Status:</strong> <StatusBadge status={selectedMessage?.status} />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f4f6f8', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
              <strong>Message Content:</strong>
              <p style={{ marginTop: '8px', lineHeight: 1.6 }}>{selectedMessage?.message}</p>
            </Box>

            {selectedMessage?.adminReply && (
              <Box sx={{ mt: 3, p: 2, bgcolor: '#eef9ff', borderLeft: '4px solid #0057A8', borderRadius: '4px' }}>
                <strong>Admin Reply:</strong>
                <p style={{ marginTop: '8px', lineHeight: 1.6 }}>{selectedMessage.adminReply}</p>
              </Box>
            )}

            {selectedMessage?.status !== 'RESOLVED' && (
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Add Admin Reply & Mark Resolved"
                  multiline
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={saving}
                  placeholder="Enter reply text here to automatically resolve..."
                />
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setSelectedMessage(null)} disabled={saving}>
            Cancel
          </Button>
          {selectedMessage?.status !== 'RESOLVED' ? (
            <Button
              onClick={handleSubmitReply}
              variant="contained"
              disabled={saving}
              sx={{ bgcolor: '#27AE60', '&:hover': { bgcolor: '#219653' } }}
            >
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Resolve Query'}
            </Button>
          ) : (
            <Button onClick={() => setSelectedMessage(null)} variant="contained" sx={{ bgcolor: '#003366' }}>
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
