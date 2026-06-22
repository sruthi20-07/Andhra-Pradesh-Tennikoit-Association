import React from 'react';
import { Box, CircularProgress, Backdrop, Typography } from '@mui/material';

export default function LoadingSpinner({ message = 'Loading...', fullScreen = false }) {
  const spinnerElement = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3,
      }}
    >
      <CircularProgress color="primary" size={48} />
      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
        {message}
      </Typography>
    </Box>
  );

  if (fullScreen) {
    return (
      <Backdrop
        open={true}
        sx={{
          color: '#ffffff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'rgba(245, 247, 250, 0.8)', // Semi-transparent AP lightgray
        }}
      >
        {spinnerElement}
      </Backdrop>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        minHeight: '200px',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {spinnerElement}
    </Box>
  );
}
