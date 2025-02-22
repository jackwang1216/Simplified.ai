import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Paper } from '@mui/material';
import FileUpload from '../components/FileUpload';
import SimplificationOptions from '../components/SimplificationOptions';
import ResultsDisplay from '../components/ResultsDisplay';
import ExportOptions from '../components/ExportOptions';
import axios from 'axios';

// Frontend runs on port 3000, backend on port 8000
const API_URL = 'http://localhost:8000';

const SimplificationPage = () => {
  const [originalText, setOriginalText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [readingLevel, setReadingLevel] = useState('intermediate');
  const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(false);
  const [isGlossaryEnabled, setIsGlossaryEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Test backend connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/test`);
        console.log('Backend connection test:', response.data);
      } catch (err) {
        console.error('Backend connection test failed:', err);
      }
    };
    testConnection();
  }, []);

  const handleTextSubmit = async (text) => {
    try {
      setIsLoading(true);
      setError(null);
      setOriginalText(text);
      
      const response = await axios.post(`${API_URL}/api/simplify`, {
        text,
        reading_level: readingLevel
      });
      
      setSimplifiedText(response.data.simplified_text);
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
      formData.append('reading_level', readingLevel);
      
      console.log('Uploading file:', file.name);
      
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Upload response:', response.data);
      
      setOriginalText(response.data.original_text);
      setSimplifiedText(response.data.simplified_text);
    } catch (err) {
      setError('Failed to process file. Please try again.');
      console.error('Error details:', err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <FileUpload 
              onFileUpload={handleFileUpload} 
              onTextSubmit={handleTextSubmit}
              isLoading={isLoading}
              error={error}
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <SimplificationOptions
              readingLevel={readingLevel}
              onReadingLevelChange={setReadingLevel}
              isTextToSpeechEnabled={isTextToSpeechEnabled}
              onTextToSpeechToggle={setIsTextToSpeechEnabled}
              isGlossaryEnabled={isGlossaryEnabled}
              onGlossaryToggle={setIsGlossaryEnabled}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <ResultsDisplay
              originalText={originalText}
              simplifiedText={simplifiedText}
              isTextToSpeechEnabled={isTextToSpeechEnabled}
              isGlossaryEnabled={isGlossaryEnabled}
              isLoading={isLoading}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <ExportOptions
              simplifiedText={simplifiedText}
              isLoading={isLoading}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SimplificationPage;
