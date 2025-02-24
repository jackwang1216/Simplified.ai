import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';
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

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <StyledContainer>
      <Typography variant="h2" component="h1" gutterBottom color="error">
        404
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate('/')}
        sx={{
          fontSize: '1.2rem',
          padding: '12px 24px',
          borderRadius: '50px',
        }}
      >
        Go Back Home
      </Button>
    </StyledContainer>
  );
};

export default ErrorPage;
