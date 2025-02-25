import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Grid, Paper, Typography, Container } from "@mui/material";
import FileUpload from "../components/FileUpload";
import SimplificationOptions from "../components/SimplificationOptions";
import ResultsDisplay from "../components/ResultsDisplay";
import ExportOptions from "../components/ExportOptions";

// Frontend runs on port 3000, backend on port 8000
const API_URL = "http://localhost:8000";

const SimplificationPage = () => {
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
        display: "flex",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        maxWidth: "100vw",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          px: { xs: 2, md: 3 },
          py: 3,
          maxWidth: "100%",
          transition: (theme) =>
            theme.transitions.create(["margin", "max-width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
            Simplify Text
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <FileUpload
                onFileUpload={handleFileUpload}
                onTextSubmit={handleTextSubmit}
                isLoading={isLoading}
                error={error}
              />
              <Box sx={{ mt: 3 }}>
                <SimplificationOptions
                  readingLevel={readingLevel}
                  onReadingLevelChange={setReadingLevel}
                  isTextToSpeechEnabled={isTextToSpeechEnabled}
                  onTextToSpeechToggle={handleTextToSpeechToggle}
                />
              </Box>
            </Paper>
          </Grid>

          {(originalText || simplifiedText) && (
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
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

          {simplifiedText && (
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <ExportOptions
                  simplifiedText={simplifiedText}
                  originalText={originalText}
                />
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default SimplificationPage;
