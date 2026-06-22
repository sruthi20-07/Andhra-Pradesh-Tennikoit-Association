import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loader({ message = 'Loading...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        width: '100%',
        gap: 2,
      }}
    >
      <CircularProgress color="primary" size={50} thickness={4.5} />
      {message && (
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
}
