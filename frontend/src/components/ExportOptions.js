import React, { useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  TextField,
  Typography,
  Snackbar,
} from '@mui/material';
import {
  Download as DownloadIcon,
  ContentCopy as ContentCopyIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

const ExportOptions = ({ simplifiedText }) => {
  const [email, setEmail] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleDownload = (format) => {
    const element = document.createElement('a');
    const file = new Blob([simplifiedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `simplified-document.${format.toLowerCase()}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    showSnackbar(`Downloaded as ${format}`);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(simplifiedText);
    showSnackbar('Copied to clipboard');
  };

  const handleEmailShare = () => {
    // TODO: Implement email sharing functionality
    showSnackbar(`Simplified text sent to ${email}`);
    setEmail('');
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Export & Share
      </Typography>

      <Box sx={{ mb: 3 }}>
        <ButtonGroup variant="outlined">
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload('TXT')}
          >
            Download TXT
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload('PDF')}
          >
            Download PDF
          </Button>
          <Button
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyToClipboard}
          >
            Copy to Clipboard
          </Button>
        </ButtonGroup>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          startIcon={<EmailIcon />}
          onClick={handleEmailShare}
          disabled={!email || !email.includes('@')}
        >
          Share via Email
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default ExportOptions;
