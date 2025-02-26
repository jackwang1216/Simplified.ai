import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Grid, Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import demoVideo from '../assets/videos/simplifyai.mp4';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: 'calc(100vh - 64px)', // Account for navbar
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(8),
}));

const HeroSection = styled(Box)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(12),
  '& h1': {
    marginBottom: theme.spacing(3),
    background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  '& .subtitle': {
    maxWidth: '800px',
    margin: '0 auto',
    marginBottom: theme.spacing(4),
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  '& .MuiSvgIcon-root': {
    fontSize: '3rem',
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
}));

const DemoSection = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '1000px',
  margin: '0 auto',
  marginTop: theme.spacing(8),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const features = [
  {
    icon: <AutoFixHighIcon />,
    title: 'AI-Powered Simplification',
    description: 'Advanced algorithms that transform complex text into clear, concise language while preserving meaning.',
  },
  {
    icon: <SpeedIcon />,
    title: 'Lightning Fast',
    description: 'Get instant results with our optimized processing engine, designed for maximum efficiency.',
  },
  {
    icon: <SecurityIcon />,
    title: 'Secure & Private',
    description: 'Your data is protected with enterprise-grade security. We never store sensitive information.',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <StyledContainer maxWidth="lg">
      <HeroSection>
        <Typography variant="h1" component="h1">
          Simplify Any Text Instantly
        </Typography>
        <Typography variant="h5" color="text.secondary" className="subtitle" gutterBottom>
          Transform complex content into clear, concise language using advanced AI technology
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/simplify')}
          sx={{
            fontSize: '1.25rem',
            padding: '12px 36px',
            borderRadius: '50px',
          }}
        >
          Try It Now
        </Button>
      </HeroSection>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <FeatureCard>
              {feature.icon}
              <Typography variant="h6" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {feature.description}
              </Typography>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>

      <DemoSection>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            See It In Action
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Watch how simplified.ai transforms complex text in seconds
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: '400px',
              backgroundColor: 'background.default',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 4,
              overflow: 'hidden',
            }}
          >
            <video
              controls
              width="100%"
              height="100%"
              style={{ objectFit: 'contain' }}
            >
              <source src={demoVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        </Box>
      </DemoSection>
    </StyledContainer>
  );
};

export default LandingPage;
