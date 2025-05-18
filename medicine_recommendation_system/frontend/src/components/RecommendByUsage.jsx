import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  CircularProgress,
  Paper,
  Fade,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function RecommendByUsage() {
  const [symptoms, setSymptoms] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = async (e) => {
    e.preventDefault();

    if (!symptoms.trim()) {
      setError('Please enter at least one symptom.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/recommend/symptoms?symptoms=${encodeURIComponent(symptoms)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations.');
      }

      const data = await response.json();
      setRecommendations(data.recommended || []);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxWidth={500}
      mx="auto"
      mt={6}
      px={3}
    >
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Medicine Recommendation by Symptoms
        </Typography>

        <Typography variant="h7" align="center" gutterBottom sx={{ mb: 2 }}>
          Warning: Please use this for a general guide and consult your doctor for more accurate medical information. Please
          input one symptom at a time for more accurate results.
        </Typography>

        <form onSubmit={fetchRecommendations}>
          <TextField
            fullWidth
            label="Enter symptoms (e.g., fever, cough)"
            variant="outlined"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            disabled={loading}
            error={!!error}
            helperText={error}
            autoFocus
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color="action" />
                </InputAdornment>
              )
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Get Recommendations'}
          </Button>
        </form>

        <Fade in={recommendations.length > 0}>
          <Box mt={4}>
            <Typography variant="subtitle1" gutterBottom>
              Recommended Medicines:
            </Typography>
            <List>
              {recommendations.map((med, idx) => (
                <ListItem
                  key={idx}
                  divider
                  sx={{
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'action.hover',
                      cursor: 'pointer',
                    },
                  }}
                >
                  {med}
                </ListItem>
              ))}
            </List>
          </Box>
        </Fade>
      </Paper>
    </Box>
  );
}

export default RecommendByUsage;
