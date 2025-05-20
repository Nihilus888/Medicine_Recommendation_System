import React from 'react';
import { Box, Typography, Link } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: 3,
        px: 2,
        textAlign: 'center',
        bgcolor: 'background.paper',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        ⚕️ This system is for informational purposes only and does not substitute professional medical advice.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        <Link href="https://github.com/nihilus888" target="_blank" rel="noopener" underline="hover">
          GitHub
        </Link>
      </Typography>
    </Box>
  );
}

export default Footer;
