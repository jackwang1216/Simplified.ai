import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  FormControlLabel,
  Typography,
  Grid,
} from "@mui/material";

const SimplificationOptions = ({
  readingLevel,
  onReadingLevelChange,
  isTextToSpeechEnabled,
  onTextToSpeechToggle,
  isGlossaryEnabled,
  onGlossaryToggle,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Simplification Options
      </Typography>

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Reading Level</InputLabel>
            <Select
              value={readingLevel}
              label="Reading Level"
              onChange={(e) => onReadingLevelChange(e.target.value)}
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="expert">Expert</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControlLabel
            control={
              <Switch
                checked={isTextToSpeechEnabled}
                onChange={(e) => onTextToSpeechToggle(e.target.checked)}
                color="primary"
              />
            }
            label="Text-to-Speech"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControlLabel
            control={
              <Switch
                checked={isGlossaryEnabled}
                onChange={(e) => onGlossaryToggle(e.target.checked)}
                color="primary"
              />
            }
            label="Glossary Explanations"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SimplificationOptions;
