import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Typography, Box, Card, CardContent, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Grid from '@mui/material/Grid';;
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import calendarService from '../../services/calendarService';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';

export default function CalendarManager() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  // Fetch events
  const { data: events, isLoading } = useQuery({
    queryKey: ['adminEvents'],
    queryFn: calendarService.getEvents
  });

  // Create event mutation
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      await api.post('/calendar', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      setOpen(false);
      setName('');
      setDate('');
      setLocation('');
      setDescription('');
      alert('Event scheduled successfully on public calendar.');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to schedule event.');
    }
  });

  // Delete event mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/calendar/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      alert('Event removed.');
    }
  });

  const handleCreate = () => {
    if (!name || !date || !location) {
      alert('Please fill out name, date, and venue location');
      return;
    }
    createMutation.mutate({ name, date, location, description });
  };

  if (isLoading) {
    return <Loader message="Loading scheduled events..." />;
  }

  const list = events || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Manage Events Calendar
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Add New Event
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Event Name</TableCell>
              <TableCell>Scheduled Date</TableCell>
              <TableCell>Venue Location</TableCell>
              <TableCell>Details</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  No scheduled activities found.
                </TableCell>
              </TableRow>
            ) : (
              list.map((ev) => (
                <TableRow key={ev.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{ev.name}</TableCell>
                  <TableCell>{ev.date}</TableCell>
                  <TableCell>{ev.location}</TableCell>
                  <TableCell>{ev.description || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => deleteMutation.mutate(ev.id)}>
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
        <DialogTitle sx={{ fontWeight: 700 }}>Add Event to Calendar</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Event Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Scheduled Date / Range"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <TextField
              fullWidth
              label="Venue Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Event Details"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
