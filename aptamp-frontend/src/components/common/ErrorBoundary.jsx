import React from 'react';
import { Box, Card, CardContent, Typography, Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/Error';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ py: 12 }}>
          <Card
            sx={{
              borderTop: '4px solid #C0392B', // AP Red top accent
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ color: '#C0392B', mb: 2 }}>
                <ErrorOutlineIcon sx={{ fontSize: 60 }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Noto Serif', serif",
                  fontWeight: 700,
                  color: '#003366',
                  mb: 1.5,
                }}
              >
                System Error / సిస్టమ్ లోపం
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                An unexpected technical error has occurred. Please refresh the page or contact the APTAMP Helpdesk at <strong>support@aptennikoit.org</strong> if the issue persists.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                sx={{ fontWeight: 600 }}
              >
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}
