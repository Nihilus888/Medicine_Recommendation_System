import React from 'react';
import { Box, Typography, Link } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        textAlign: 'center',
        bgcolor: '#000',
      }}
    >
      <Typography variant="body2" color="white">
        ⚕️ This system is for informational purposes only and does not substitute professional medical advice.
      </Typography>
      <Typography variant="body2" color="white" sx={{ mt: 1 }}>
        <Link href="https://github.com/nihilus888" target="_blank" rel="noopener" underline="hover">
          GitHub
        </Link>
      </Typography>
    </Box>
  );
}

export default Footer;
