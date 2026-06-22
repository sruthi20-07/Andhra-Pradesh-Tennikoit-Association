import React from 'react';
import { Box, Container, Typography, Stack, Link, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import APTALogo from './APTALogo';
import { useTranslation } from 'react-i18next';

export default function APFooter() {
  const { t } = useTranslation();

  return (
    <Box sx={{ width: '100%' }}>
      {/* Top Section */}
      <Box sx={{ bgcolor: '#002244', color: '#ffffff', py: 6, borderTop: '4px solid #F4A300' }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            {/* Col 1: Logo & Description */}
            <Grid item xs={12} sm={6} md={3}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                <APTALogo size={50} style={{ filter: 'none' }} />
                <Typography variant="h6" sx={{ fontFamily: "'Noto Serif', serif", fontWeight: 800, fontSize: '1rem', color: '#F4A300', lineHeight: 1.25 }}>
                  {t('hero.title')}
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.6, fontSize: '0.85rem' }}>
                The Andhra Pradesh Tennikoit Association (APTA) is dedicated to discovering and preparing champion tennikoit athletes across the 26 districts of Andhra Pradesh, representing the state at national championships and trials.
              </Typography>
            </Grid>

            {/* Col 2: Quick Links */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle1" sx={{ color: '#F4A300', fontWeight: 800, mb: 2.5, borderBottom: '2px solid #F4A300', pb: 0.5, display: 'inline-block', letterSpacing: '0.5px' }}>
                Quick Links
              </Typography>
              <Grid container spacing={1}>
                {[
                  { to: '/', label: t('nav.home') },
                  { to: '/about', label: t('nav.about') },
                  { to: '/committee', label: t('nav.committee') },
                  { to: '/tournaments', label: t('nav.tournaments') },
                  { to: '/rankings', label: t('nav.rankings') },
                  { to: '/gallery', label: t('nav.gallery') },
                  { to: '/downloads', label: t('nav.downloads') },
                  { to: '/contact', label: t('nav.contact') },
                ].map((item) => (
                  <Grid key={item.label} item xs={6}>
                    <Link
                      component={RouterLink}
                      to={item.to}
                      sx={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, '&:hover': { color: '#F4A300' } }}
                    >
                      {item.label}
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Col 3: Contact */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle1" sx={{ color: '#F4A300', fontWeight: 800, mb: 2.5, borderBottom: '2px solid #F4A300', pb: 0.5, display: 'inline-block', letterSpacing: '0.5px' }}>
                Contact Details
              </Typography>
              <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem', mb: 1.2, lineHeight: 1.5 }}>
                <strong>Secretary General:</strong> K.N.V. Satyanarayana
              </Typography>
              <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem', mb: 1.2, lineHeight: 1.5 }}>
                <strong>Address:</strong> D.No 19-7-53/1, Gavarapalem, Anakapalli, Andhra Pradesh
              </Typography>
              <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem', mb: 1.2 }}>
                <strong>Phone:</strong> 7013643701
              </Typography>
              <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem', mb: 1.2 }}>
                <strong>Email:</strong> satyanarayanaknv9@gmail.com
              </Typography>
            </Grid>

            {/* Col 4: Social Links */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle1" sx={{ color: '#F4A300', fontWeight: 800, mb: 2.5, borderBottom: '2px solid #F4A300', pb: 0.5, display: 'inline-block', letterSpacing: '0.5px' }}>
                Connect With Us
              </Typography>
              <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem', mb: 2 }}>
                Follow official matches, selection updates, referee list announcements, and state trials.
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <IconButton component="a" href="https://facebook.com" target="_blank" sx={{ color: '#cbd5e1', '&:hover': { color: '#F4A300' }, bgcolor: 'rgba(255,255,255,0.05)', p: 1 }}>
                  <FacebookIcon fontSize="small" />
                </IconButton>
                <IconButton component="a" href="https://instagram.com" target="_blank" sx={{ color: '#cbd5e1', '&:hover': { color: '#F4A300' }, bgcolor: 'rgba(255,255,255,0.05)', p: 1 }}>
                  <InstagramIcon fontSize="small" />
                </IconButton>
                <IconButton component="a" href="https://youtube.com" target="_blank" sx={{ color: '#cbd5e1', '&:hover': { color: '#F4A300' }, bgcolor: 'rgba(255,255,255,0.05)', p: 1 }}>
                  <YouTubeIcon fontSize="small" />
                </IconButton>
                <IconButton component="a" href="https://twitter.com" target="_blank" sx={{ color: '#cbd5e1', '&:hover': { color: '#F4A300' }, bgcolor: 'rgba(255,255,255,0.05)', p: 1 }}>
                  <TwitterIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Bottom bar */}
      <Box sx={{ bgcolor: '#001a33', py: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Container maxWidth="xl">
          <Grid container spacing={2} justifyContent="space-between" alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                © {new Date().getFullYear()} Andhra Pradesh Tennikoit Association. All Rights Reserved. | Government of Andhra Pradesh Sports Department
              </Typography>
            </Grid>
            <Grid sx={{ textAlign: { xs: 'left', md: 'right' } }} item xs={12} md={6}>
              <Stack direction="row" spacing={2.5} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                {['Privacy Policy', 'Terms of Service', 'Accessibility Statement', 'Sitemap'].map((link) => (
                  <Link key={link} href="#" sx={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.75rem', '&:hover': { color: '#F4A300' } }}>
                    {link}
                  </Link>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
