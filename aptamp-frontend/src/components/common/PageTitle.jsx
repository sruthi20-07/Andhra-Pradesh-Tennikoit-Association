import React from 'react';
import { Box, Typography } from '@mui/material';

export default function PageTitle({ title, subtitle }) {
  return (
    <Box
      sx={{
        borderTop: '3px solid #F4A300', // Gold accent top border
        pt: 2.5,
        pb: 3,
        mb: 4,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontFamily: "'Noto Serif', Georgia, serif",
          fontWeight: 700,
          color: '#003366', // AP Navy
          fontSize: { xs: '1.5rem', sm: '2rem' },
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body2"
          sx={{
            color: '#5D6D7E', // AP Dark Gray
            mt: 1,
            fontSize: '0.9rem',
            fontWeight: 500,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
