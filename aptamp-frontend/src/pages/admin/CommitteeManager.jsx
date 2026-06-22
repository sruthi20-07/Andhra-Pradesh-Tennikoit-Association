import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Typography, Box, Card, CardContent, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Grid from '@mui/material/Grid';;
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import committeeService from '../../services/committeeService';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';

export default function CommitteeManager() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [district, setDistrict] = useState('');
  const [contact, setContact] = useState('');

  // Fetch committee
  const { data: members, isLoading } = useQuery({
    queryKey: ['adminCommittee'],
    queryFn: committeeService.getMembers
  });

  // Create member mutation
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      await api.post('/committee', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCommittee'] });
      setOpen(false);
      setName('');
      setRole('');
      setDistrict('');
      setContact('');
      alert('Committee member details added successfully.');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to add committee member.');
    }
  });

  // Delete member mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/committee/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCommittee'] });
      alert('Committee member deleted.');
    }
  });

  const handleCreate = () => {
    if (!name || !role || !district) {
      alert('Please fill out name, role, and district');
      return;
    }
    createMutation.mutate({ name, role, district, contact });
  };

  if (isLoading) {
    return <Loader message="Loading committee rosters..." />;
  }

  const list = members || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Manage Committee Board Directory
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          New Board Member
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Designation Role</TableCell>
              <TableCell>District Represented</TableCell>
              <TableCell>Email / Contact</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  No board members added yet.
                </TableCell>
              </TableRow>
            ) : (
              list.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{m.name}</TableCell>
                  <TableCell>{m.role}</TableCell>
                  <TableCell>{m.district}</TableCell>
                  <TableCell>{m.contact || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => deleteMutation.mutate(m.id)}>
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
        <DialogTitle sx={{ fontWeight: 700 }}>Add Board Member</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Role (e.g. President)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <TextField
              fullWidth
              label="Representing District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
            <TextField
              fullWidth
              label="Contact Email"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            color="primary"
            disabled={createMutation.isPending}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
