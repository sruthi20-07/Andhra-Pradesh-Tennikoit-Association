import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Typography, Box, Card, CardContent, Button, Container, Alert, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';;
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DescriptionIcon from '@mui/icons-material/Description';
import tournamentService from '../../services/tournamentService';
import Loader from '../../components/common/Loader';
import { formatDate, formatCurrency } from '../../utils/formatters';

export default function PublicTournaments() {
  const navigate = useNavigate();

  const { data: tournaments, isLoading } = useQuery({
    queryKey: ['publicTournaments'],
    queryFn: () => tournamentService.getTournaments()
  });

  if (isLoading) {
    return <Loader message="Loading tournaments directory..." />;
  }

  const list = tournaments || [];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.dark', mb: 1.5 }}>
          Association Tournaments / టోర్నమెంట్లు
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 650, mx: 'auto' }}>
          Explore official Andhra Pradesh Tennikoit Association state-level, district-level championships, and selection trials. Sign up or login to submit registrations.
        </Typography>
      </Box>

      {list.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          There are no tournament schedules registered at this time. Please check back later for updates.
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {list.map((t) => (
            <Grid key={t.id} item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <EmojiEventsIcon color="primary" sx={{ fontSize: '2rem' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                      {t.title || t.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, minHeight: 40 }}>
                    {t.description || 'Official state association tournament.'}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Start Date:</strong> {formatDate(t.startDate)}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>End Date:</strong> {formatDate(t.endDate)}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Registration Closes:</strong>{' '}
                    <span style={{ color: new Date(t.registrationDeadline) < new Date() ? 'red' : 'inherit' }}>
                      {formatDate(t.registrationDeadline)}
                    </span>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Registration Fee:</strong> {formatCurrency(t.entryFee !== undefined ? t.entryFee : t.registrationFee)}
                  </Typography>

                  {/* Documents List */}
                  {t.documents && t.documents.length > 0 && (
                    <Box sx={{ mt: 2, mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                        Guidelines & Attachments:
                      </Typography>
                      {t.documents.map((doc) => {
                        const fileLink = doc.filePath;
                        return (
                          <Box key={doc.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f8fafc', p: 1, borderRadius: 1, border: '1px solid #e2e8f0' }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px' }} title={doc.fileName}>
                              {doc.fileName}
                            </Typography>
                            <Stack direction="row" spacing={0.5}>
                              <Button
                                size="small"
                                variant="text"
                                href={fileLink}
                                target="_blank"
                                sx={{ minWidth: 'auto', p: '2px 6px', fontSize: '0.65rem' }}
                              >
                                View
                              </Button>
                              <Button
                                size="small"
                                variant="text"
                                href={fileLink}
                                target="_blank"
                                download
                                sx={{ minWidth: 'auto', p: '2px 6px', fontSize: '0.65rem' }}
                              >
                                Download
                              </Button>
                            </Stack>
                          </Box>
                        );
                      })}
                    </Box>
                  )}

                  {t.brochureUrl && (!t.documents || t.documents.length === 0) && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DescriptionIcon />}
                      href={`http://localhost:8082/api/files/download?objectName=${t.brochureUrl}`}
                      target="_blank"
                      sx={{ borderRadius: 2 }}
                    >
                      Download Brochure
                    </Button>
                  )}
                </CardContent>
                <Box sx={{ p: 3, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    color="secondary"
                    component={RouterLink}
                    to="/login"
                    disabled={new Date(t.registrationDeadline) < new Date()}
                    sx={{ borderRadius: 2, py: 1, fontWeight: 700, textTransform: 'none' }}
                  >
                    {new Date(t.registrationDeadline) < new Date() ? 'Registration Closed' : 'Login to Register'}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
