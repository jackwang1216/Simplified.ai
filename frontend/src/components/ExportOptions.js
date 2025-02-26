import React, { useState } from 'react';
import axios from 'axios';
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

const API_URL = "http://localhost:8000";

const ExportOptions = ({ simplifiedText, readingLevel }) => {
  const [email, setEmail] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleDownload = async (format) => {
    try {
      if (format.toLowerCase() === 'pdf') {
        const response = await axios.post(
          `${API_URL}/api/generate-pdf`,
          {
            text: simplifiedText,
            reading_level: readingLevel,
            text_to_speech: false
          },
          {
            responseType: 'blob',
          }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'simplified-document.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const element = document.createElement('a');
        const file = new Blob([simplifiedText], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `simplified-document.${format.toLowerCase()}`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
      
      showSnackbar(`Downloaded as ${format}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      showSnackbar('Error downloading file. Please try again.');
    }
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
            onClick={() => handleDownload('PDF')}
          >
            Download PDF
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload('TXT')}
          >
            Download TXT
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
