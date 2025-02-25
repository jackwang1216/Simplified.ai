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
              <MenuItem value="5">5th Grade</MenuItem>
              <MenuItem value="8">8th Grade</MenuItem>
              <MenuItem value="12">12th Grade</MenuItem>
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
      </Grid>
    </Box>
  );
};

export default SimplificationOptions;
