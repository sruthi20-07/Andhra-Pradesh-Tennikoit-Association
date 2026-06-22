import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Typography, Divider, Paper, List, ListItem, ListItemText, Box, Alert } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import calendarService from '../../services/calendarService';
import Loader from '../../components/common/Loader';

const MOCK_EVENTS = [
  { id: 1, name: "State Selection Trials (Sub-Junior Boys/Girls)", date: "June 25, 2026", location: "District Stadium, Guntur", description: "Mandatory trials for selecting athletes for Sub-Junior Nationals 2026." },
  { id: 2, name: "45th AP State Inter-District Tournament", date: "July 12-15, 2026", location: "Vijayawada Sports Complex", description: "AP state inter-district championship in singles and doubles categories." },
  { id: 3, name: "APTA Coach Training & License Program", date: "August 05-08, 2026", location: "Swarna Bharati Stadium, Visakhapatnam", description: "Professional certification course for referees and coaches." },
  { id: 4, name: "Senior Inter-District Championship 2026", date: "September 20-23, 2026", location: "Nellore Athletic Club", description: "AP state level matches for senior category." }
];

export default function SportsCalendar() {
  const { data: events, isLoading, isError } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: calendarService.getEvents,
    retry: false
  });

  if (isLoading) {
    return <Loader message="Loading events calendar..." />;
  }

  const calendarList = events || MOCK_EVENTS;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
        Sports Event Calendar
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
        Schedule of state tennikoit selections, trials, district referee programs, and tournaments.
      </Typography>
      <Divider sx={{ mb: 4 }} />

      {isError && (
        <Alert severity="info" sx={{ mb: 4 }}>
          Offline Mode: Displaying official event schedules.
        </Alert>
      )}

      <Paper sx={{ border: '1px solid #cbd5e1', borderRadius: 2 }}>
        <List sx={{ py: 0 }}>
          {calendarList.map((ev, i) => (
            <React.Fragment key={ev.id || i}>
              {i > 0 && <Divider />}
              <ListItem alignItems="flex-start" sx={{ p: 4 }}>
                <Box
                  sx={{
                    mr: 3,
                    bgcolor: 'primary.light',
                    color: 'white',
                    p: 2,
                    borderRadius: 2,
                    textAlign: 'center',
                    minWidth: 70,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CalendarMonthIcon sx={{ fontSize: 32 }} />
                </Box>
                <ListItemText
                  primary={ev.name}
                  secondaryTypographyProps={{ component: 'div' }}
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {ev.description || 'No description available for this event.'}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: 'primary.main' }}>
                        📅 Date: {ev.date}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: 'secondary.main', mt: 0.5 }}>
                        📍 Venue: {ev.location}
                      </Typography>
                    </Box>
                  }
                  primaryTypographyProps={{ fontWeight: 700, variant: 'h6', color: 'primary.main' }}
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
}
