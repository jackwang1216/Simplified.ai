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
  Paper,
  useTheme,
} from "@mui/material";
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import SchoolIcon from '@mui/icons-material/School';

const SimplificationOptions = ({
  readingLevel,
  onReadingLevelChange,
  isTextToSpeechEnabled,
  onTextToSpeechToggle,
}) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SchoolIcon sx={{ color: theme.palette.primary.main }} />
        Simplification Options
      </Typography>

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 1,
              border: `1px solid ${theme.palette.grey[200]}`,
              backgroundColor: theme.palette.grey[50],
            }}
          >
            <FormControl fullWidth>
              <InputLabel>Reading Level</InputLabel>
              <Select
                value={readingLevel}
                label="Reading Level"
                onChange={(e) => onReadingLevelChange(e.target.value)}
                sx={{
                  backgroundColor: '#fff',
                }}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="expert">Expert</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 1,
              border: `1px solid ${theme.palette.grey[200]}`,
              backgroundColor: theme.palette.grey[50],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RecordVoiceOverIcon sx={{ color: isTextToSpeechEnabled ? theme.palette.primary.main : theme.palette.grey[400] }} />
              <FormControlLabel
                control={
                  <Switch
                    checked={isTextToSpeechEnabled}
                    onChange={(e) => onTextToSpeechToggle(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body1" color={isTextToSpeechEnabled ? 'primary' : 'text.secondary'}>
                    Text-to-Speech
                  </Typography>
                }
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SimplificationOptions;
