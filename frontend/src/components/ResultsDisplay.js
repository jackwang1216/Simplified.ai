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
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ChatIcon from '@mui/icons-material/Chat';

const ResultsDisplay = ({
  originalText,
  simplifiedText,
  isTextToSpeechEnabled,
  isGlossaryEnabled,
  isLoading,
}) => {
  const [question, setQuestion] = useState('');
  const [chatVisible, setChatVisible] = useState(false);

  const handleTextToSpeech = (text) => {
    // TODO: Implement text-to-speech functionality
    console.log('Playing text:', text);
  };

  const handleQuestionSubmit = () => {
    // TODO: Implement question handling
    console.log('Question submitted:', question);
    setQuestion('');
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
              alignItems: isLoading ? 'center' : 'flex-start',
              justifyContent: isLoading ? 'center' : 'flex-start',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
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
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button
          startIcon={<ChatIcon />}
          onClick={() => setChatVisible(!chatVisible)}
          variant="outlined"
        >
          Ask AI
        </Button>

        {chatVisible && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask a question about the document..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button
              variant="contained"
              onClick={handleQuestionSubmit}
              disabled={!question.trim()}
            >
              Ask
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ResultsDisplay;
