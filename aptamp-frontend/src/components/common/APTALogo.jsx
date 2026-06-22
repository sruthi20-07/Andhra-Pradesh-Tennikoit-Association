import React from 'react';
import { Box } from '@mui/material';
import aptaLogo from '../../assets/images/apta-logo.png';

export default function APTALogo({ size, style = {} }) {
  // If size is provided (e.g. inside Footer where size=46 is passed), respect it,
  // otherwise fallback to the responsive design.
  return (
    <Box
      component="img"
      src={aptaLogo}
      alt="APTA Logo"
      sx={{
        height: size ? `${size}px` : { xs: '45px', sm: '60px', md: '70px' },
        width: 'auto',
        objectFit: 'contain',
        ...style
      }}
    />
  );
}

