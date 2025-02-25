import React, { useState } from "react";
import axios from "axios";
import { Box, Grid, Paper, Typography } from "@mui/material";
import FileUpload from "../components/FileUpload";
import SimplificationOptions from "../components/SimplificationOptions";
import ResultsDisplay from "../components/ResultsDisplay";
import ExportOptions from "../components/ExportOptions";

// Frontend runs on port 3000, backend on port 8000
const API_URL = "http://localhost:8000";

const SimplificationPage = () => {
  const [originalText, setOriginalText] = useState("");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [readingLevel, setReadingLevel] = useState("elementary");
  const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Test backend connection on component mount
  // useEffect(() => {
  //   const testConnection = async () => {
  //     try {
  //       const response = await axios.get(`${API_URL}/api/test`);
  //       console.log("Backend connection test:", response.data);
  //     } catch (err) {
  //       console.error("Backend connection test failed:", err);
  //     }
  //   };
  //   testConnection();
  // }, []);

  const handleTextSubmit = async (text) => {
    try {
      setIsLoading(true);
      setError(null);
      setOriginalText(text);
      setSimplifiedText("");

      const response = await axios.post(`${API_URL}/api/simplify`, {
        text,
        reading_level: readingLevel,
        text_to_speech: isTextToSpeechEnabled,
      });

      setSimplifiedText(response.data.simplified_text);
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
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("reading_level", readingLevel);
      formData.append("text_to_speech", isTextToSpeechEnabled);

      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setOriginalText(response.data.original_text);
      setSimplifiedText(response.data.simplified_text);
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
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <SimplificationOptions
                readingLevel={readingLevel}
                onReadingLevelChange={setReadingLevel}
                isTextToSpeechEnabled={isTextToSpeechEnabled}
                onTextToSpeechToggle={setIsTextToSpeechEnabled}
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
    </Box>
  );
};

export default SimplificationPage;
