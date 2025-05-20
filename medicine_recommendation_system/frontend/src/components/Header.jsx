import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

function Header() {
  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar>
        <MedicalServicesIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Medicine Recommendation System
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;