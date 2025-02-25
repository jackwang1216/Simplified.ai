import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import FileUpload from "../components/FileUpload";
import SimplificationOptions from "../components/SimplificationOptions";
import ResultsDisplay from "../components/ResultsDisplay";
import ExportOptions from "../components/ExportOptions";
import GlossaryPanel from "../components/GlossaryPanel";
import axios from "axios";

// Frontend runs on port 3000, backend on port 8000
const API_URL = "http://localhost:8000";

const SimplificationPage = () => {
  const [originalText, setOriginalText] = useState("");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [readingLevel, setReadingLevel] = useState("intermediate");
  const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(false);
  const [isGlossaryEnabled, setIsGlossaryEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [glossaryItems, setGlossaryItems] = useState([]);

  // Test backend connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/test`);
        console.log("Backend connection test:", response.data);
      } catch (err) {
        console.error("Backend connection test failed:", err);
      }
    };
    testConnection();
  }, []);

  const handleTextSubmit = async (text) => {
    try {
      setIsLoading(true);
      setError(null);
      setOriginalText(text);
      setGlossaryItems([]); // Reset glossary items

      const response = await axios.post(`${API_URL}/api/simplify`, {
        text,
        reading_level: readingLevel,
        generate_glossary: isGlossaryEnabled,
      });

      setSimplifiedText(response.data.simplified_text);
      if (response.data.glossary && Array.isArray(response.data.glossary)) {
        setGlossaryItems(response.data.glossary);
      }
    } catch (err) {
      setError("Failed to simplify text. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("reading_level", readingLevel);
      formData.append("generate_glossary", isGlossaryEnabled);

      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setOriginalText(response.data.original_text);
      setSimplifiedText(response.data.simplified_text);
      if (response.data.glossary) {
        setGlossaryItems(response.data.glossary);
      }
    } catch (err) {
      setError("Failed to process file. Please try again.");
      console.error("Error details:", err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGlossaryToggle = (enabled) => {
    setIsGlossaryEnabled(enabled);
    if (!enabled) {
      setSelectedWord(null);
    }
  };

  const handleWordClick = (word) => {
    setSelectedWord(word);
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
          ...(isGlossaryEnabled && {
            mr: { xs: 0, md: "250px" },
            maxWidth: { md: "calc(100% - 250px)" },
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
                onGlossaryToggle={handleGlossaryToggle}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <ResultsDisplay
                originalText={originalText}
                simplifiedText={simplifiedText}
                isLoading={isLoading}
                error={error}
                isTextToSpeechEnabled={isTextToSpeechEnabled}
                glossaryEnabled={isGlossaryEnabled}
                glossaryItems={glossaryItems}
                onWordClick={handleWordClick}
              />
            </Paper>
          </Grid>

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

      <GlossaryPanel
        open={isGlossaryEnabled}
        onClose={() => setIsGlossaryEnabled(false)}
        glossaryItems={glossaryItems}
        selectedWord={selectedWord}
        simplifiedText={simplifiedText}
      />
    </Box>
  );
};

export default SimplificationPage;
