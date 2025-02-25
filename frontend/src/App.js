import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SimplificationPage from './pages/SimplificationPage';
import ErrorPage from './pages/ErrorPage';
import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Local development server

const theme = createTheme({
  palette: {
    primary: {
      main: '#3a86ff',
      light: '#60a5fa',
      dark: '#1e40af',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
  },
});

function NavBar() {
  return (
    <AppBar position="fixed" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            simplified.ai
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography
              component={Link}
              to="/simplify"
              sx={{
                color: 'text.primary',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': { color: 'primary.main' },
              }}
            >
              Simplify
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

function App() {
  const [originalText, setOriginalText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTextSubmit = async (text, readingLevel, textToSpeech) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/api/simplify`, {
        text,
        reading_level: readingLevel,
        text_to_speech: textToSpeech
      });

      setOriginalText(response.data.original_text);
      setSimplifiedText(response.data.simplified_text);
      if (response.data.audio_url) {
        setAudioUrl(`${API_URL}${response.data.audio_url}`);
      }
    } catch (err) {
      setError('Failed to simplify text. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('reading_level', 'intermediate');
      formData.append('text_to_speech', true);

      const response = await axios.post(`${API_URL}/api/upload`, formData);

      setOriginalText(response.data.original_text);
      setSimplifiedText(response.data.simplified_text);
      if (response.data.audio_url) {
        setAudioUrl(`${API_URL}${response.data.audio_url}`);
      }
    } catch (err) {
      setError('Failed to process file. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <NavBar />
          <Box sx={{ pt: 8 }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/simplify" element={
                <SimplificationPage
                  onTextSubmit={handleTextSubmit}
                  onFileUpload={handleFileUpload}
                  originalText={originalText}
                  simplifiedText={simplifiedText}
                  audioUrl={audioUrl}
                  isLoading={isLoading}
                  error={error}
                />
              } />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
