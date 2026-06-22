import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Card, CardContent, Typography, Paper, Box, Divider, List, ListItem, ListItemText, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid';;
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PageTitle from '../../components/common/PageTitle';
import axiosInstance from '../../api/axiosInstance';

const MOCK_CALENDAR = [
  { id: 1, date: 'June 25, 2026', title: 'State Selection Trials (Sub-Junior)', location: 'Guntur District Stadium', desc: 'Selection trials for state representatives for Sub-Junior nationals.' },
  { id: 2, date: 'July 12, 2026', title: '45th AP State Inter-District Tournament', location: 'Vijayawada IGMC Stadium', desc: 'Main inter-district championship in boys, girls, men and women categories.' },
  { id: 3, date: 'August 05, 2026', title: 'APTA Coach Training & License Program', location: 'Visakhapatnam Swarna Bharathi Indoor Arena', desc: 'Official coaching accreditation and technical rules training program.' }
];

export default function CalendarPage() {
  const { data: calendarEventsRaw = [], isLoading } = useQuery({
    queryKey: ['publicCalendar'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/calendar');
        const list = Array.isArray(response.data) ? response.data : (response.data?.content || response.data?.data || []);
        return list.length ? list : MOCK_CALENDAR;
      } catch (err) {
        return MOCK_CALENDAR;
      }
    }
  });

  const calendarEvents = Array.isArray(calendarEventsRaw) ? calendarEventsRaw : (calendarEventsRaw?.content || calendarEventsRaw?.data || []);

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <PageTitle title="Sports Calendar 2026 / క్రీడా క్యాలెండర్" subtitle="Yearly schedule of upcoming tennikoit trials, district selections, and referee clinics" />

      {isLoading ? (
        <Skeleton variant="rectangular" height={300} />
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <List sx={{ p: 0 }}>
              {calendarEvents.map((ev) => (
                <Card key={ev.id} sx={{ mb: 3, borderLeft: '5px solid #0057A8' }}>
                  <CardContent sx={{ p: 3, display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                    <Box sx={{ bgcolor: 'rgba(0, 87, 168, 0.08)', color: '#0057A8', p: 2, borderRadius: '4px', textAlign: 'center', minWidth: 90 }}>
                      <CalendarMonthIcon sx={{ fontSize: 32, mb: 0.5 }} />
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 800 }}>
                        2026
                      </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#003366', mb: 1 }}>
                        {ev.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                        {ev.desc}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Date:</strong> {ev.date}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Venue:</strong> {ev.location}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderTop: '4px solid #F4A300' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#003366', mb: 2 }}>
                  Calendar Information
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.6 }}>
                  Schedules are subject to change based on federation guidelines. Updates will be broadcasted in the ticker marquee and in player dashboards.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Players registered on APTAMP will receive SMS notifications for trial events in their selected district.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
