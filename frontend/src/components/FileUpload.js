import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const DropzoneArea = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  borderStyle: 'dashed',
  borderWidth: 2,
  borderColor: theme.palette.grey[400],
  backgroundColor: theme.palette.grey[50],
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.grey[100],
  },
}));

const FileUpload = ({ onFileUpload, onTextSubmit, isLoading, error }) => {
  const [text, setText] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    multiple: false,
    disabled: isLoading,
  });

  const handleTextSubmit = () => {
    if (text.trim()) {
      onTextSubmit(text);
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <DropzoneArea {...getRootProps()}>
        <input {...getInputProps()} />
        {isLoading ? (
          <CircularProgress sx={{ mb: 2 }} />
        ) : (
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        )}
        <Typography variant="h6" gutterBottom>
          {isDragActive
            ? 'Drop your file here'
            : isLoading
            ? 'Processing...'
            : 'Drag & drop your file here'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Supported formats: PDF, DOCX, TXT
        </Typography>
      </DropzoneArea>

      <Divider sx={{ my: 3 }}>OR</Divider>

      <Box sx={{ mt: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="Paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        />
        <Button
          variant="contained"
          onClick={handleTextSubmit}
          sx={{ mt: 2 }}
          disabled={!text.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Processing...
            </>
          ) : (
            'Simplify Text'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default FileUpload;
