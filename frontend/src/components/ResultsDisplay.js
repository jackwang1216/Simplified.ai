import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const ResultsDisplay = ({
  originalText,
  simplifiedText,
  audioUrl,
  isTextToSpeechEnabled,
  isLoading,
  error,
  onRetry,
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleTextToSpeech = () => {
    if (audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => {
          setIsPlaying(false);
        };
        audioRef.current.onerror = () => {
          setAudioError('Failed to play audio. Please try again.');
          setIsPlaying(false);
        };
      }

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          setAudioError('Failed to play audio. Please try again.');
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, [audioUrl]);

  const handleQuestionSubmit = async () => {
    if (!question.trim()) return;

    try {
      setIsAnswering(true);
      setAudioError(null);

      const response = await axios.post(`${API_URL}/api/question`, {
        question: question,
        context: simplifiedText
      });

      setAnswer(response.data.answer);
      setQuestion('');
    } catch (err) {
      setAudioError('Failed to get answer. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsAnswering(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuestionSubmit();
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Results
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              height: '400px',
              overflow: 'auto',
              backgroundColor: '#f5f5f5',
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Original Document
            </Typography>
            <Typography variant="body1">{originalText}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Simplified Version
            </Typography>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <>
                <Typography paragraph>{simplifiedText}</Typography>
                {isTextToSpeechEnabled && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                      onClick={handleTextToSpeech}
                      disabled={!audioUrl}
                      color="primary"
                      sx={{ 
                        backgroundColor: isPlaying ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                        '&:hover': {
                          backgroundColor: isPlaying ? 'rgba(25, 118, 210, 0.2)' : 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <VolumeUpIcon />
                    </IconButton>
                    {audioError && (
                      <Alert severity="error" onClose={() => setAudioError(null)}>
                        {audioError}
                      </Alert>
                    )}
                  </Box>
                )}
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">
                Ask AI about the text
              </Typography>
            </Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {answer && (
              <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f0f7ff' }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Answer:
                </Typography>
                <Typography variant="body1">{answer}</Typography>
              </Paper>
            )}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask any question about the text..."
                disabled={isAnswering}
              />
              <Button
                variant="contained"
                onClick={handleQuestionSubmit}
                disabled={!question.trim() || isAnswering}
                sx={{ minWidth: '100px', height: 'fit-content', mt: 1 }}
              >
                {isAnswering ? <CircularProgress size={24} /> : 'Ask'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResultsDisplay;
