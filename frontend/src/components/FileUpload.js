import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  useTheme,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';

const DropzoneArea = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  borderStyle: 'dashed',
  borderWidth: 2,
  borderColor: theme.palette.grey[300],
  backgroundColor: theme.palette.grey[50],
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.grey[100],
  },
}));

const FileUpload = ({ onFileUpload, onTextSubmit, isLoading }) => {
  const theme = useTheme();
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

  const handleClearText = () => {
    setText('');
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          placeholder="Enter your text here or upload a file below..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#fff',
              '&:hover': {
                '& > fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            },
          }}
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          {text && (
            <Tooltip title="Clear text">
              <IconButton
                onClick={handleClearText}
                disabled={isLoading}
                size="small"
                sx={{ color: theme.palette.grey[500] }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          <Button
            variant="contained"
            onClick={handleTextSubmit}
            disabled={!text.trim() || isLoading}
            endIcon={<SendIcon />}
          >
            Simplify
          </Button>
        </Box>
      </Box>

      <DropzoneArea {...getRootProps()}>
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 48, color: theme.palette.grey[400], mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop your file here' : 'Drag and drop your file here'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Supported formats: PDF, DOCX, TXT
        </Typography>
      </DropzoneArea>
    </Box>
  );
};

export default FileUpload;
