import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  gap: theme.spacing(4),
}));

const VideoPlaceholder = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '800px',
  height: '400px',
  backgroundColor: theme.palette.grey[200],
  borderRadius: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: theme.spacing(4),
}));

const LandingPage = ({ onStartClick }) => {
  return (
    <StyledContainer>
      <Typography variant="h2" component="h1" gutterBottom>
        simplified.ai
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={onStartClick}
        sx={{
          fontSize: '1.5rem',
          padding: '16px 32px',
          borderRadius: '50px',
        }}
      >
        Simplify Now!
      </Button>
      <VideoPlaceholder>
        <Typography variant="h6" color="text.secondary">
          Video Demo Coming Soon
        </Typography>
      </VideoPlaceholder>
    </StyledContainer>
  );
};

export default LandingPage;
