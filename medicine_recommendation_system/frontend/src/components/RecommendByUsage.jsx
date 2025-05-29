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
  Divider,
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
      maxWidth={2000}
      mx="auto"
      sx={{
        bgcolor: '#000',
        minHeight: '100vh',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          borderRadius: 4,
          bgcolor: '#1e1e1e',
          color: '#fff',
        }}
      >
        <Typography variant="h4" align="center" fontWeight={600} gutterBottom>
          Symptom-Based Medicine Recommender
        </Typography>

        <Typography variant="body2" align="center" mb={3} sx={{ color: '#bbb' }}>
          This is a general guide. Always consult a healthcare professional. For best results, input one symptom at a time.
        </Typography>

        <Divider sx={{ mb: 3, bgcolor: '#333' }} />

        <form onSubmit={fetchRecommendations}>
          <TextField
            fullWidth
            label="Enter a symptom (e.g., fever, cough)"
            variant="outlined"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            disabled={loading}
            error={!!error}
            helperText={error}
            autoFocus
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: '#888' }} />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              sx: { color: '#aaa' },
            }}
            sx={{
              input: { color: '#fff' },
              '.MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#555' },
                '&:hover fieldset': { borderColor: '#888' },
                '&.Mui-focused fieldset': { borderColor: '#0af' },
              },
              mb: 2,
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Get Recommendations'}
          </Button>
        </form>

        <Fade in={recommendations.length > 0}>
          <Box mt={5}>
            <Typography variant="h6" fontWeight={500} gutterBottom align="center">
              Recommended Medicines
            </Typography>
            <List>
              {recommendations.map((med, idx) => (
                <ListItem
                  key={idx}
                  divider
                  display='flex'
                  justifyContent='center'
                  textAlign='center'
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    transition: 'background 0.3s',
                    color: '#fff',
                    borderBottom: '1px solid #333',
                    '&:hover': {
                      bgcolor: '#2a2a2a',
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
