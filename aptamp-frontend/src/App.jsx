import React, { useEffect } from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, Button } from '@mui/material';
import { Toaster } from 'react-hot-toast';

// Config & Redux & i18n
import { store } from './store/store';
import { queryClient } from './config/queryClient';
import { theme } from './theme';
import './i18n';
import './App.css';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import PlayerLayout from './components/layout/PlayerLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Public Pages
import ScrollToTop from './components/common/ScrollToTop';
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import CommitteePage from './pages/public/CommitteePage';
import TournamentsPublicPage from './pages/public/TournamentsPublicPage';
import TournamentDetailPage from './pages/public/TournamentDetailPage';
import RankingsPublicPage from './pages/public/RankingsPublicPage';
import GalleryPublicPage from './pages/public/GalleryPublicPage';
import CalendarPage from './pages/public/CalendarPage';
import DownloadsPage from './pages/public/DownloadsPage';
import ContactPage from './pages/public/ContactPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Player Pages
import PlayerDashboard from './pages/player/PlayerDashboard';
import PlayerProfile from './pages/player/PlayerProfile';
import PlayerEditProfile from './pages/player/PlayerEditProfile';
import PlayerTournaments from './pages/player/PlayerTournaments';
import PlayerTournamentDetail from './pages/player/PlayerTournamentDetail';
import PlayerMyRegistrations from './pages/player/PlayerMyRegistrations';
import PlayerRankings from './pages/player/PlayerRankings';
import PlayerMyRanking from './pages/player/PlayerMyRanking';
import PlayerGallery from './pages/player/PlayerGallery';
import PlayerCalendar from './pages/player/PlayerCalendar';
import PlayerDownloads from './pages/player/PlayerDownloads';
import PlayerNotifications from './pages/player/PlayerNotifications';
import PlayerPayments from './pages/player/PlayerPayments';
import PlayerFeedback from './pages/player/PlayerFeedback';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPlayerList from './pages/admin/players/AdminPlayerList';
import AdminPlayerDetail from './pages/admin/players/AdminPlayerDetail';
import AdminPlayerApprove from './pages/admin/players/AdminPlayerApprove';
import AdminTournamentList from './pages/admin/tournaments/AdminTournamentList';
import AdminTournamentCreate from './pages/admin/tournaments/AdminTournamentCreate';
import AdminTournamentEdit from './pages/admin/tournaments/AdminTournamentEdit';
import AdminTournamentRegistrations from './pages/admin/tournaments/AdminTournamentRegistrations';
import AdminRankingList from './pages/admin/rankings/AdminRankingList';
import AdminRankingEdit from './pages/admin/rankings/AdminRankingEdit';
import AdminGalleryList from './pages/admin/gallery/AdminGalleryList';
import AdminGalleryUpload from './pages/admin/gallery/AdminGalleryUpload';
import AdminNotificationList from './pages/admin/notifications/AdminNotificationList';
import AdminNotificationCreate from './pages/admin/notifications/AdminNotificationCreate';
import AdminDownloadList from './pages/admin/downloads/AdminDownloadList';
import AdminDownloadUpload from './pages/admin/downloads/AdminDownloadUpload';
import AdminSettings from './pages/admin/settings/AdminSettings';
import OfflineRegistrationsManager from './pages/admin/tournaments/OfflineRegistrationsManager';
import ContactQueriesManager from './pages/admin/contacts/ContactQueriesManager';
import FeedbackManager from './pages/admin/feedback/FeedbackManager';

const Unauthorized = () => (
  <Box sx={{ p: 5, textAlign: 'center' }}>
    <Typography variant="h4" color="error" gutterBottom>403 — Unauthorized</Typography>
    <Typography variant="body1">You do not have permission to view this page.</Typography>
    <Button href="/" variant="contained" color="primary" sx={{ mt: 3 }}>Go Home</Button>
  </Box>
);

const NotFound = () => (
  <Box sx={{ p: 5, textAlign: 'center' }}>
    <Typography variant="h4" color="error" gutterBottom>404 — Page Not Found</Typography>
    <Typography variant="body1">The requested portal resource is unavailable.</Typography>
    <Button href="/" variant="contained" color="primary" sx={{ mt: 3 }}>Go Home</Button>
  </Box>
);

function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC PATHS */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/committee" element={<CommitteePage />} />
        <Route path="/tournaments" element={<TournamentsPublicPage />} />
        <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
        <Route path="/rankings" element={<RankingsPublicPage />} />
        <Route path="/gallery" element={<GalleryPublicPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/downloads" element={<DownloadsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* PLAYER SECURED PATHS */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_PLAYER']} />}>
        <Route element={<PlayerLayout />}>
          <Route path="/player/dashboard" element={<PlayerDashboard />} />
          <Route path="/player/profile" element={<PlayerProfile />} />
          <Route path="/player/profile/edit" element={<PlayerEditProfile />} />
          <Route path="/player/tournaments" element={<PlayerTournaments />} />
          <Route path="/player/tournaments/:id" element={<PlayerTournamentDetail />} />
          <Route path="/player/my-registrations" element={<PlayerMyRegistrations />} />
          <Route path="/player/rankings" element={<PlayerRankings />} />
          <Route path="/player/my-ranking" element={<PlayerMyRanking />} />
          <Route path="/player/gallery" element={<PlayerGallery />} />
          <Route path="/player/calendar" element={<PlayerCalendar />} />
          <Route path="/player/downloads" element={<PlayerDownloads />} />
          <Route path="/player/notifications" element={<PlayerNotifications />} />
          <Route path="/player/payments" element={<PlayerPayments />} />
          <Route path="/player/feedback" element={<PlayerFeedback />} />
        </Route>
      </Route>

      {/* ADMIN SECURED PATHS */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/players" element={<AdminPlayerList />} />
          <Route path="/admin/players/:id" element={<AdminPlayerDetail />} />
          <Route path="/admin/players/approve" element={<AdminPlayerApprove />} />
          <Route path="/admin/tournaments" element={<AdminTournamentList />} />
          <Route path="/admin/tournaments/create" element={<AdminTournamentCreate />} />
          <Route path="/admin/tournaments/:id/edit" element={<AdminTournamentEdit />} />
          <Route path="/admin/tournaments/:id/registrations" element={<AdminTournamentRegistrations />} />
          <Route path="/admin/rankings" element={<AdminRankingList />} />
          <Route path="/admin/rankings/edit" element={<AdminRankingEdit />} />
          <Route path="/admin/gallery" element={<AdminGalleryList />} />
          <Route path="/admin/gallery/upload" element={<AdminGalleryUpload />} />
          <Route path="/admin/notifications" element={<AdminNotificationList />} />
          <Route path="/admin/notifications/create" element={<AdminNotificationCreate />} />
          <Route path="/admin/downloads" element={<AdminDownloadList />} />
          <Route path="/admin/downloads/upload" element={<AdminDownloadUpload />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/registrations" element={<OfflineRegistrationsManager />} />
          <Route path="/admin/contacts" element={<ContactQueriesManager />} />
          <Route path="/admin/feedbacks" element={<FeedbackManager />} />
        </Route>
      </Route>

      {/* GENERAL PATHS */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Toaster position="top-right" reverseOrder={false} />
          <BrowserRouter>
            <ScrollToTop />
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
