import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Container,
  Divider,
  useTheme,
  LinearProgress,
  Alert,
  Fade
} from "@mui/material";
import FileUpload from "../components/FileUpload";
import SimplificationOptions from "../components/SimplificationOptions";
import ResultsDisplay from "../components/ResultsDisplay";
import ExportOptions from "../components/ExportOptions";

// Frontend runs on port 3000, backend on port 8000
const API_URL = "http://localhost:8000";

const SimplificationPage = () => {
  const theme = useTheme();
  const [originalText, setOriginalText] = useState("");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [readingLevel, setReadingLevel] = useState("beginner");
  const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate speech when toggle is switched on
  useEffect(() => {
    const generateSpeech = async () => {
      if (isTextToSpeechEnabled && simplifiedText && !audioUrl) {
        try {
          setIsLoading(true);
          const response = await axios.post(`${API_URL}/api/simplify`, {
            text: simplifiedText,
            reading_level: readingLevel,
            text_to_speech: true
          });
          
          if (response.data.audio_url) {
            setAudioUrl(`${API_URL}${response.data.audio_url}`);
          }
        } catch (err) {
          setError("Failed to generate speech. Please try again.");
          console.error("Error:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    generateSpeech();
  }, [isTextToSpeechEnabled, API_URL, simplifiedText, audioUrl]);

  const handleTextToSpeechToggle = (enabled) => {
    setIsTextToSpeechEnabled(enabled);
    if (!enabled) {
      setAudioUrl(null);
    }
  };

  const handleTextSubmit = async (text) => {
    try {
      setIsLoading(true);
      setError(null);
      setOriginalText(text);
      setSimplifiedText("");
      setAudioUrl(null);

      const response = await axios.post(`${API_URL}/api/simplify`, {
        text,
        reading_level: readingLevel,
        text_to_speech: isTextToSpeechEnabled,
      });

      setSimplifiedText(response.data.simplified_text);
      if (response.data.audio_url) {
        setAudioUrl(`${API_URL}${response.data.audio_url}`);
      }
    } catch (error) {
      setError("An error occurred while simplifying the text. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setIsLoading(true);
      setError(null);
      setSimplifiedText("");
      setAudioUrl(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("reading_level", readingLevel);
      formData.append("text_to_speech", isTextToSpeechEnabled);

      const response = await axios.post(`${API_URL}/api/upload`, formData);

      setOriginalText(response.data.original_text);
      setSimplifiedText(response.data.simplified_text);
      if (response.data.audio_url) {
        setAudioUrl(`${API_URL}${response.data.audio_url}`);
      }
    } catch (error) {
      setError("An error occurred while processing the file. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.grey[50],
        pt: 4,
        pb: 8
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            Text Simplification
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Simplify complex text into clear, easy-to-understand language
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Input Section */}
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: '#fff'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                Input Text
              </Typography>
              <FileUpload
                onFileUpload={handleFileUpload}
                onTextSubmit={handleTextSubmit}
                isLoading={isLoading}
                error={error}
              />
              
              <Box sx={{ mt: 4 }}>
                <Divider sx={{ mb: 3 }} />
                <SimplificationOptions
                  readingLevel={readingLevel}
                  onReadingLevelChange={setReadingLevel}
                  isTextToSpeechEnabled={isTextToSpeechEnabled}
                  onTextToSpeechToggle={handleTextToSpeechToggle}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Loading Indicator */}
          {isLoading && (
            <Grid item xs={12}>
              <Fade in={isLoading} timeout={1000}>
                <Box sx={{ width: '100%' }}>
                  <LinearProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                    Processing your text...
                  </Typography>
                </Box>
              </Fade>
            </Grid>
          )}

          {/* Error Message */}
          {error && (
            <Grid item xs={12}>
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </Grid>
          )}

          {/* Results Section */}
          {(originalText || simplifiedText) && (
            <Grid item xs={12}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: '#fff'
                }}
              >
                <ResultsDisplay
                  originalText={originalText}
                  simplifiedText={simplifiedText}
                  audioUrl={audioUrl}
                  isTextToSpeechEnabled={isTextToSpeechEnabled}
                  isLoading={isLoading}
                  error={error}
                  onRetry={() => {
                    setOriginalText("");
                    setSimplifiedText("");
                    setAudioUrl(null);
                    setError(null);
                  }}
                />
              </Paper>
            </Grid>
          )}

          {/* Export Options */}
          {simplifiedText && (
            <Grid item xs={12}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: '#fff'
                }}
              >
                <ExportOptions
                  simplifiedText={simplifiedText}
                  originalText={originalText}
                />
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default SimplificationPage;
