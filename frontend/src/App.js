import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './pages/LandingPage';
import SimplificationPage from './pages/SimplificationPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  const [showSimplification, setShowSimplification] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showSimplification ? (
        <SimplificationPage />
      ) : (
        <LandingPage onStartClick={() => setShowSimplification(true)} />
      )}
    </ThemeProvider>
  );
}

export default App;
