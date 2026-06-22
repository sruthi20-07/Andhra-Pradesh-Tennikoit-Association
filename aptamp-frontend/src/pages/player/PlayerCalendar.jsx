import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography, Paper, List, ListItem, ListItemText, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid';;
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PageTitle from '../../components/common/PageTitle';
import axiosInstance from '../../api/axiosInstance';

const MOCK_CALENDAR = [
  { id: 1, date: 'June 25, 2026', title: 'State Selection Trials (Sub-Junior)', location: 'Guntur District Stadium', desc: 'Selection trials for state representatives for Sub-Junior nationals.' },
  { id: 2, date: 'July 12, 2026', title: '45th AP State Inter-District Tournament', location: 'Vijayawada IGMC Stadium', desc: 'Main inter-district championship in boys, girls, men and women categories.' },
  { id: 3, date: 'August 05, 2026', title: 'APTA Coach Training & License Program', location: 'Visakhapatnam Swarna Bharathi Indoor Arena', desc: 'Official coaching accreditation and technical rules training program.' }
];

export default function PlayerCalendar() {
  const { data: calendarEvents = [], isLoading } = useQuery({
    queryKey: ['playerCalendarList'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/calendar');
        return response.data.length ? response.data : MOCK_CALENDAR;
      } catch (err) {
        return MOCK_CALENDAR;
      }
    }
  });

  return (
    <Box>
      <PageTitle title="Event Schedules / క్యాలెండర్" subtitle="Schedules for district tournaments, state leagues, and selecions" />

      {isLoading ? (
        <Skeleton variant="rectangular" height={300} />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <List sx={{ p: 0 }}>
              {calendarEvents.map((ev) => (
                <Card key={ev.id} sx={{ mb: 2, borderLeft: '5px solid #0057A8' }}>
                  <CardContent sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ bgcolor: 'rgba(0, 87, 168, 0.08)', color: '#0057A8', p: 1.5, borderRadius: '4px', textAlign: 'center', minWidth: 70 }}>
                      <CalendarMonthIcon />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#003366' }}>{ev.title}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block">{ev.desc}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mt: 0.5 }}>Date: {ev.date} | Venue: {ev.location}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </List>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
