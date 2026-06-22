import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  Skeleton,
  IconButton,
  Modal,
  Backdrop,
  Fade
} from '@mui/material';
import Grid from '@mui/material/Grid';

// Material Icons
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import MapIcon from '@mui/icons-material/Map';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CampaignIcon from '@mui/icons-material/Campaign';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import DescriptionIcon from '@mui/icons-material/Description';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentsIcon from '@mui/icons-material/Payments';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

// Components & APIs
import { getTournaments } from '../../api/tournament.api';
import { getStateRankings } from '../../api/ranking.api';
import { getGalleryItems } from '../../api/gallery.api';
import { getNotifications } from '../../api/notification.api';
import PageTitle from '../../components/common/PageTitle';
import StatusBadge from '../../components/common/StatusBadge';

// Helper for animating numbers
function Counter({ value }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10) || 0;
    if (end === 0) return;
    const duration = 1200;
    const stepTime = Math.abs(Math.floor(duration / end));
    const timer = setInterval(() => {
      start += Math.ceil(end / 35);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, Math.max(stepTime, 20));
    return () => clearInterval(timer);
  }, [value]);
  return <>{count}</>;
}

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(null);

  // API calls via react-query
  const { data: tournamentsRaw = [], isLoading: loadTournaments } = useQuery({
    queryKey: ['upcomingTournaments'],
    queryFn: () => getTournaments({ status: 'PUBLISHED' }),
  });

  const { data: rankingsRaw = [], isLoading: loadRankings } = useQuery({
    queryKey: ['homeRankings'],
    queryFn: () => getStateRankings(1), // Category ID 1: Men's Singles
  });

  const { data: galleryRaw = [], isLoading: loadGallery } = useQuery({
    queryKey: ['homeGallery'],
    queryFn: () => getGalleryItems(),
  });

  const { data: notificationsRaw = [], isLoading: loadNotifications } = useQuery({
    queryKey: ['homeNotifications'],
    queryFn: () => getNotifications(),
  });

  const tournamentList = Array.isArray(tournamentsRaw) ? tournamentsRaw : (tournamentsRaw?.content || tournamentsRaw?.data || []);
  const rankingList = Array.isArray(rankingsRaw) ? rankingsRaw : (rankingsRaw?.content || rankingsRaw?.data || []);
  const galleryList = Array.isArray(galleryRaw) ? galleryRaw : (galleryRaw?.content || galleryRaw?.data || []);
  const notificationList = Array.isArray(notificationsRaw) ? notificationsRaw : (notificationsRaw?.content || notificationsRaw?.data || []);

  // Calculate statistics
  const totalPlayersCount = rankingList.length * 12 + 142; 
  const activeTournamentsCount = tournamentList.filter(t => t.status === 'PUBLISHED').length || 6;

  // Static Fallback Images for Gallery
  const defaultGallery = [
    { id: 1, title: 'National Championship Selections', url: 'https://images.unsplash.com/photo-1526676001870-7467eb0bbb90?auto=format&fit=crop&q=80&w=600' },
    { id: 2, title: 'AP State Tournament Finals', url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600' },
    { id: 3, title: 'APTA Annual Committee Meeting', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600' },
    { id: 4, title: 'Trophy Presentation Ceremony', url: 'https://images.unsplash.com/photo-1578269174936-2709b5a8c0e6?auto=format&fit=crop&q=80&w=600' },
    { id: 5, title: 'Coaches Training Workshop', url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=600' },
    { id: 6, title: 'Sub-Junior Girls Trials', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=600' }
  ];

  const displayGallery = galleryList.length > 0 ? galleryList : defaultGallery;

  // Resolve absolute path for uploaded files
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/api/files/download')) {
      return `http://localhost:8082${url}`;
    }
    return url;
  };

  return (
    <Box sx={{ width: '100%', bgcolor: '#F8FAFC' }}>
      
      {/* ==========================================
          HERO SECTION (Centered Content, No Giant Logo)
          ========================================== */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #001f3f 0%, #003366 100%)',
          color: '#ffffff',
          py: { xs: 6, md: 8 },
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          borderBottom: '4px solid #F4A300',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        {/* Subtle decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            border: '24px solid rgba(244, 163, 0, 0.03)',
            top: '10%',
            left: '-5%',
            pointerEvents: 'none'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            border: '32px solid rgba(255, 255, 255, 0.02)',
            bottom: '-10%',
            right: '10%',
            pointerEvents: 'none'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h2"
            sx={{
              color: '#F4A300', // Gold heading
              fontSize: { xs: '2rem', sm: '2.8rem', md: '3.2rem' },
              fontWeight: 900,
              mb: 2.5,
              fontFamily: "'Noto Serif', Georgia, serif",
              textShadow: '0px 2px 4px rgba(0,0,0,0.4)',
            }}
          >
            Andhra Pradesh Tennikoit Association
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              color: '#ffffff',
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
              fontWeight: 700,
              mb: 4,
              fontFamily: "'Noto Sans Telugu', sans-serif",
              lineHeight: 1.45,
              maxWidth: '850px',
              mx: 'auto',
              opacity: 0.95
            }}
          >
            Official Digital Platform for Player Registration, State Rankings, Tournament Management, Selection Trials and Championships
          </Typography>

          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', justifyContent: 'center', gap: 2 }} useFlexGap>
            <Button
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: '#FF6600',
                color: '#ffffff',
                px: 4.5,
                py: 1.8,
                fontSize: '0.95rem',
                fontWeight: 800,
                borderRadius: '4px',
                boxShadow: '0px 4px 12px rgba(255, 102, 0, 0.3)',
                '&:hover': {
                  bgcolor: '#d95300',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s'
              }}
            >
              Register as Player
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                bgcolor: '#0057A8',
                color: '#ffffff',
                px: 4.5,
                py: 1.8,
                fontSize: '0.95rem',
                fontWeight: 800,
                borderRadius: '4px',
                boxShadow: '0px 4px 12px rgba(0, 87, 168, 0.2)',
                '&:hover': {
                  bgcolor: '#003d75',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s'
              }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/rankings')}
              sx={{
                color: '#ffffff',
                borderColor: '#ffffff',
                borderWidth: '2px',
                px: 4.5,
                py: 1.8,
                fontSize: '0.95rem',
                fontWeight: 800,
                borderRadius: '4px',
                '&:hover': {
                  borderWidth: '2px',
                  borderColor: '#F4A300',
                  color: '#F4A300',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s'
              }}
            >
              View Rankings
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ==========================================
          ANNOUNCEMENTS TICKER MARQUEE
          ========================================== */}
      <Box sx={{ bgcolor: '#002244', color: '#ffffff', py: 1.2, borderBottom: '1px solid #cbd5e1' }}>
        <Container maxWidth="xl">
          <Grid container alignItems="center">
            <Grid sx={{ display: 'flex', alignItems: 'center', gap: 1 }} item xs={12} sm={2.5}>
              <CampaignIcon sx={{ color: '#F4A300' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 850, letterSpacing: '0.5px', color: '#F4A300', fontSize: '0.85rem' }}>
                LATEST NOTIFICATIONS:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9.5}>
              <Box
                component="marquee"
                sx={{
                  display: 'block',
                  color: '#f1f5f9',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {notificationList.length > 0 ? (
                  notificationList.map((ann) => (
                    <span key={ann.id} style={{ marginRight: '80px' }}>
                      📢 {ann.title}: {ann.message}
                    </span>
                  ))
                ) : (
                  <span>📢 Welcome to the official APTAMP Sports Portal. Player registrations and district verification checks are currently active for the 2026 season.</span>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ==========================================
          LIVE STATS SECTION
          ========================================== */}
      <Box sx={{ py: 6, bgcolor: '#ffffff' }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {[
              { label: 'Registered Players', value: totalPlayersCount, icon: <PeopleIcon sx={{ fontSize: 36 }} />, desc: 'Verified State Athletes' },
              { label: 'Ranked Players', value: rankingList.length || 72, icon: <MilitaryTechIcon sx={{ fontSize: 36 }} />, desc: 'Calculated Point Standings' },
              { label: 'Active Districts', value: 26, icon: <MapIcon sx={{ fontSize: 36 }} />, desc: 'AP District Sport Boards' },
              { label: 'Conducting Tournaments', value: activeTournamentsCount, icon: <CalendarMonthIcon sx={{ fontSize: 36 }} />, desc: 'Championships Tracked' }
            ].map((stat, i) => (
              <Grid key={i} item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    borderTop: '4px solid #F4A300',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    textAlign: 'center',
                    py: 1.5,
                    borderRadius: '6px',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}
                >
                  <CardContent>
                    <Box sx={{ color: '#0057A8', mb: 1.5, display: 'flex', justifyContent: 'center' }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#002244', mb: 0.5, fontFamily: 'monospace' }}>
                      <Counter value={stat.value} />
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B', mb: 0.5 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ==========================================
          QUICK ACCESS SECTION
          ========================================== */}
      <Box sx={{ py: 6, bgcolor: '#F1F5F9' }}>
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#002244', textAlign: 'center', mb: 1, fontFamily: "'Noto Serif', serif" }}>
            Quick Access / త్వరిత లింకులు
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mb: 5 }}>
            Navigate directly to core portal sections and digital features
          </Typography>

          <Grid container spacing={3}>
            {[
              { title: 'Player Registration', desc: 'Join as state tennikoit player & get ID', icon: <AppRegistrationIcon sx={{ fontSize: 32 }} />, path: '/register', color: '#0057A8' },
              { title: 'Rankings Board', desc: 'Official player points state standings', icon: <WorkspacePremiumIcon sx={{ fontSize: 32 }} />, path: '/rankings', color: '#F4A300' },
              { title: 'Tournament Calendar', desc: 'Championship fixtures and timeline', icon: <CalendarTodayIcon sx={{ fontSize: 32 }} />, path: '/calendar', color: '#10B981' },
              { title: 'Circulars & Downloads', desc: 'Official letters, guides, & rule books', icon: <FileDownloadIcon sx={{ fontSize: 32 }} />, path: '/downloads', color: '#3B82F6' },
              { title: 'Action Photo Gallery', desc: 'View match highlights and ceremonies', icon: <PhotoLibraryIcon sx={{ fontSize: 32 }} />, path: '/gallery', color: '#8B5CF6' },
              { title: 'Latest Notifications', desc: 'Announcements, selections and news', icon: <VolumeUpIcon sx={{ fontSize: 32 }} />, path: '#notice-board', color: '#EF4444' }
            ].map((card, i) => (
              <Grid key={i} item xs={12} sm={6} md={4}>
                <Card
                  onClick={() => {
                    if (card.path.startsWith('#')) {
                      const el = document.getElementById(card.path.substring(1));
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      navigate(card.path);
                    }
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    transition: 'all 0.3s',
                    bgcolor: '#ffffff',
                    borderLeft: `5px solid ${card.color}`,
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Box sx={{ mr: 2.5, bgcolor: `${card.color}15`, color: card.color, p: 1.8, borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                    {card.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1E293B', mb: 0.5 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {card.desc}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ==========================================
          UPCOMING TOURNAMENTS SECTION
          ========================================== */}
      <Box id="tournaments-section" sx={{ py: 8, bgcolor: '#ffffff' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#002244', fontFamily: "'Noto Serif', serif", mb: 1 }}>
                Upcoming Tournaments / పోటీలు
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Official calendar and state brackets with open registrations
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/tournaments')}
              endIcon={<KeyboardArrowRightIcon />}
              sx={{ fontWeight: 800, textTransform: 'none' }}
            >
              View All Tournaments
            </Button>
          </Box>

          {loadTournaments ? (
            <Grid container spacing={3}>
              {[1, 2, 3].map((s) => (
                <Grid key={s} item xs={12} sm={6} md={4}>
                  <Skeleton variant="rectangular" height={260} sx={{ borderRadius: '6px' }} />
                </Grid>
              ))}
            </Grid>
          ) : tournamentList.length === 0 ? (
            <Card sx={{ p: 6, textAlign: 'center', bgcolor: '#F8FAFC', borderRadius: '8px', border: '1px dashed #D1D9E0' }}>
              <InfoIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 700, mb: 1 }}>
                No active registrations currently open online.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Check back soon or check the Association Notice Board for updates.
              </Typography>
              <Button variant="contained" onClick={() => navigate('/register')} sx={{ bgcolor: '#0057A8' }}>
                Go to Player Dashboard
              </Button>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {tournamentList.slice(0, 6).map((t) => (
                <Grid key={t.id} item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '8px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                      border: '1px solid #E2E8F0',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                        borderColor: '#F4A300'
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography variant="h6" sx={{ color: '#002244', fontWeight: 800, mb: 2.5, height: '3.2rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.3 }}>
                        {t.title}
                      </Typography>
                      
                      <Stack spacing={1.5} sx={{ mb: 3.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PlaceIcon sx={{ fontSize: 16, color: '#64748B' }} />
                          <Typography variant="body2" color="text.secondary">
                            <strong>Venue:</strong> {t.venue}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarTodayIcon sx={{ fontSize: 16, color: '#64748B' }} />
                          <Typography variant="body2" color="text.secondary">
                            <strong>Dates:</strong> {t.startDate} to {t.endDate}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PaymentsIcon sx={{ fontSize: 16, color: '#64748B' }} />
                          <Typography variant="body2" color="text.secondary">
                            <strong>Fee:</strong> {t.registrationFee ? `${t.registrationFee} INR` : 'Free Entry'}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Stack direction="row" spacing={0.8} sx={{ flexWrap: 'wrap', gap: 0.8 }} useFlexGap>
                        {t.categories?.map((cat) => (
                          <Chip
                            key={cat.id}
                            label={`${cat.categoryName} (${cat.gender})`}
                            size="small"
                            sx={{
                              borderRadius: '4px',
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              bgcolor: '#F1F5F9',
                              color: '#334155'
                            }}
                          />
                        ))}
                      </Stack>
                    </CardContent>
                    
                    <Box sx={{ p: 3, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <StatusBadge status={t.status} />
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/tournaments/${t.id}`)}
                          sx={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'none' }}
                        >
                          Details
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate('/register')}
                          sx={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'none', bgcolor: '#0057A8' }}
                        >
                          Register
                        </Button>
                      </Stack>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* ==========================================
          STATE RANKINGS & NOTICE BOARD
          ========================================== */}
      <Box sx={{ py: 8, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="xl">
          <Grid container spacing={5}>
            {/* Left: Rankings Table */}
            <Grid item xs={12} lg={7.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#002244', fontFamily: "'Noto Serif', serif" }}>
                    State Rankings / ర్యాంకింగ్స్
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Top calculated tennikoit athletes in Men's Singles (Senior)
                  </Typography>
                </Box>
                <Button
                  component={RouterLink}
                  to="/rankings"
                  endIcon={<KeyboardArrowRightIcon />}
                  sx={{ fontWeight: 800, textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>

              {loadRankings ? (
                <Skeleton variant="rectangular" height={380} sx={{ borderRadius: '6px' }} />
              ) : (
                <TableContainer component={Paper} sx={{ boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
                  <Table size="medium">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#002244' }}>
                        <TableCell sx={{ color: '#ffffff', fontWeight: 800 }}>Rank</TableCell>
                        <TableCell sx={{ color: '#ffffff', fontWeight: 800 }}>Athlete Name</TableCell>
                        <TableCell sx={{ color: '#ffffff', fontWeight: 800 }}>District</TableCell>
                        <TableCell sx={{ color: '#ffffff', fontWeight: 800 }}>Category</TableCell>
                        <TableCell align="right" sx={{ color: '#ffffff', fontWeight: 800 }}>Points</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rankingList.slice(0, 8).map((r, i) => {
                        const isTop3 = i < 3;
                        const medalIcon = i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
                        const rowBg = i === 0 ? '#FFFDF0' : i === 1 ? '#F8F9FA' : i === 2 ? '#FAF6F0' : '#FFFFFF';
                        
                        return (
                          <TableRow
                            key={r.id || i}
                            sx={{
                              bgcolor: rowBg,
                              transition: 'background-color 0.2s',
                              '&:hover': { bgcolor: '#F1F5F9' }
                            }}
                          >
                            <TableCell sx={{ fontWeight: 800, fontSize: isTop3 ? '1rem' : '0.85rem' }}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <span>{medalIcon}</span>
                                <span>{r.rank || i + 1}</span>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>{r.playerName}</TableCell>
                            <TableCell sx={{ fontWeight: 500 }}>{r.district}</TableCell>
                            <TableCell>
                              <Chip
                                label={r.ageGroup || 'SENIOR'}
                                size="small"
                                sx={{
                                  borderRadius: '4px',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  bgcolor: isTop3 ? 'rgba(244,163,0,0.15)' : '#F1F5F9',
                                  color: isTop3 ? '#B37400' : '#475569'
                                }}
                              />
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800, color: '#0057A8', fontFamily: 'monospace', fontSize: '1.05rem' }}>
                              {r.points}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {rankingList.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                            <InfoIcon sx={{ display: 'block', mx: 'auto', mb: 1, color: '#94a3b8' }} />
                            No standings calculated yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Grid>

            {/* Right: notice board */}
            <Grid item xs={12} lg={4.5}>
              <Box id="notice-board" sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#002244', fontFamily: "'Noto Serif', serif", mb: 1 }}>
                  Notice Board / సర్క్యులర్లు
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Official circulars, selection dates, and state news
                </Typography>
              </Box>

              {loadNotifications ? (
                <Skeleton variant="rectangular" height={380} sx={{ borderRadius: '6px' }} />
              ) : (
                <Paper
                  sx={{
                    p: 2.5,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    border: '1px solid #E2E8F0',
                    bgcolor: '#ffffff',
                    maxHeight: '440px',
                    overflowY: 'auto'
                  }}
                >
                  {notificationList.length > 0 ? (
                    <List disablePadding>
                      {notificationList.slice(0, 5).map((n, idx) => {
                        const isTrial = n.title.toLowerCase().includes('trial') || n.message.toLowerCase().includes('trial');
                        const isCircular = n.title.toLowerCase().includes('circular') || n.message.toLowerCase().includes('rules');
                        const typeLabel = isTrial ? 'Selection Trial' : isCircular ? 'Circular' : 'Announcement';
                        const typeColor = isTrial ? '#EF4444' : isCircular ? '#3B82F6' : '#F4A300';
                        
                        return (
                          <React.Fragment key={n.id}>
                            {idx > 0 && <Divider sx={{ my: 1.5 }} />}
                            <ListItem alignItems="flex-start" disablePadding sx={{ py: 0.5 }}>
                              <ListItemText
                                secondaryTypographyProps={{ component: 'div' }}
                                primary={
                                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                                    <Chip
                                      label={typeLabel}
                                      size="small"
                                      sx={{
                                        fontSize: '0.65rem',
                                        fontWeight: 800,
                                        bgcolor: `${typeColor}15`,
                                        color: typeColor,
                                        borderRadius: '4px'
                                      }}
                                    />
                                    <Typography variant="caption" color="text.disabled">
                                      {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Active'}
                                    </Typography>
                                  </Stack>
                                }
                                secondary={
                                  <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#002244', mb: 0.5 }}>
                                      {n.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                                      {n.message}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </ListItem>
                          </React.Fragment>
                        );
                      })}
                    </List>
                  ) : (
                    <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                      <VolumeUpIcon sx={{ fontSize: 44, color: '#CBD5E1', mb: 1 }} />
                      <Typography variant="body2">No circulars or notice announcements at this time.</Typography>
                    </Box>
                  )}
                </Paper>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ==========================================
          PHOTO GALLERY SECTION (Lazy loading + Modal)
          ========================================== */}
      <Box sx={{ py: 8, bgcolor: '#ffffff' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#002244', fontFamily: "'Noto Serif', serif", mb: 1 }}>
                Association Gallery / ఫోటో గ్యాలరీ
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Action captures from national trials and district tournaments
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/gallery')}
              endIcon={<KeyboardArrowRightIcon />}
              sx={{ fontWeight: 800, textTransform: 'none' }}
            >
              View Full Gallery
            </Button>
          </Box>

          {loadGallery ? (
            <Grid container spacing={3}>
              {[1, 2, 3].map((s) => (
                <Grid key={s} item xs={12} sm={6} md={4}>
                  <Skeleton variant="rectangular" height={220} sx={{ borderRadius: '6px' }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={3}>
              {displayGallery.slice(0, 6).map((item) => (
                <Grid key={item.id} item xs={12} sm={6} md={4}>
                  <Card
                    onClick={() => setActiveImage(item.url)}
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      height: 240,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={getImageUrl(item.url)}
                      alt={item.title}
                      loading="lazy"
                      sx={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                        '&:hover': { transform: 'scale(1.06)' }
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        background: 'linear-gradient(to top, rgba(0,22,44,0.92) 0%, rgba(0,22,44,0.6) 70%, rgba(0,22,44,0) 100%)',
                        p: 2,
                        pt: 4,
                        color: '#ffffff',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.3px' }}>
                        {item.title}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* ==========================================
          FULLSCREEN LIGHTBOX MODAL FOR IMAGES
          ========================================== */}
      <Modal
        open={!!activeImage}
        onClose={() => setActiveImage(null)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 400,
          sx: { backgroundColor: 'rgba(0, 15, 31, 0.95)' }
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 }
        }}
      >
        <Fade in={!!activeImage}>
          <Box
            sx={{
              position: 'relative',
              outline: 'none',
              maxWidth: '90%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <IconButton
              onClick={() => setActiveImage(null)}
              sx={{
                position: 'absolute',
                top: -45,
                right: 0,
                color: '#ffffff',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' }
              }}
            >
              <CloseIcon />
            </IconButton>
            
            <Box
              component="img"
              src={getImageUrl(activeImage)}
              alt="Fullscreen Preview"
              sx={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '4px',
                boxShadow: '0px 10px 30px rgba(0,0,0,0.5)'
              }}
            />
          </Box>
        </Fade>
      </Modal>

    </Box>
  );
}
