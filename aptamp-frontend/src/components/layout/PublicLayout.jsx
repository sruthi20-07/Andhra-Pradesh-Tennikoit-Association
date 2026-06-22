import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import APHeader from '../common/APHeader';
import APNavbar from '../common/APNavbar';
import APFooter from '../common/APFooter';

export default function PublicLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <APHeader />
      <APNavbar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#F5F7FA', width: '100%' }}>
        <Outlet />
      </Box>
      <APFooter />
    </Box>
  );
}
