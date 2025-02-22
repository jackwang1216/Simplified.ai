import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Collapse,
  Alert,
  Divider,
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ChatIcon from '@mui/icons-material/Chat';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const ResultsDisplay = ({
  originalText,
  simplifiedText,
  isTextToSpeechEnabled,
  isGlossaryEnabled,
  isLoading,
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [error, setError] = useState(null);

  const handleTextToSpeech = (text) => {
    // TODO: Implement text-to-speech functionality
    console.log('Playing text:', text);
  };

  const handleQuestionSubmit = async () => {
    if (!question.trim()) return;
    
    try {
      setIsAnswering(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/api/question`, {
        question: question,
        context: simplifiedText
      });
      
      setAnswer(response.data.answer);
      setQuestion('');
    } catch (err) {
      setError('Failed to get answer. Please try again.');
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
          <Paper
            sx={{
              p: 2,
              height: '400px',
              overflow: 'auto',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
                width: '100%',
              }}
            >
              <Typography variant="subtitle1">Simplified Version</Typography>
              {isTextToSpeechEnabled && (
                <IconButton
                  onClick={() => handleTextToSpeech(simplifiedText)}
                  color="primary"
                >
                  <VolumeUpIcon />
                </IconButton>
              )}
            </Box>
            {isLoading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography>Simplifying your text...</Typography>
              </Box>
            ) : (
              <Typography variant="body1">{simplifiedText}</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <QuestionAnswerIcon color="primary" sx={{ mr: 1 }} />
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
