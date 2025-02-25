import React from 'react';
import {
  Drawer,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useTheme,
  Divider,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const GlossaryPanel = ({
  open,
  onClose,
  glossaryItems = [],
  selectedWord,
  simplifiedText,
}) => {
  const theme = useTheme();
  const drawerWidth = 250;

  // Scroll to the selected word's definition
  React.useEffect(() => {
    if (selectedWord) {
      const element = document.getElementById(`glossary-item-${selectedWord}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedWord]);

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={open}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        position: 'fixed',
        height: '100%',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.default,
          borderLeft: `1px solid ${theme.palette.divider}`,
          position: 'fixed',
          height: '100%',
          transition: theme.transitions.create('transform', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          ...(!open && {
            transform: `translateX(${drawerWidth}px)`,
          }),
        },
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Glossary
        </Typography>
        <IconButton 
          onClick={onClose} 
          size="small"
          sx={{ 
            '&:hover': { 
              backgroundColor: theme.palette.action.hover 
            } 
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      
      {glossaryItems.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary" variant="body2">
            {simplifiedText ? 
              "No complex words found in the text that need explanation." :
              "Submit some text to see complex words and their explanations."}
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 2 }}>
          {glossaryItems.map(({ word, definition, examples }, index) => (
            <ListItem
              key={index}
              id={`glossary-item-${word}`}
              component={Paper}
              variant="outlined"
              sx={{
                mb: 2,
                borderRadius: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
                backgroundColor: selectedWord === word ? 'action.selected' : 'background.paper',
                transition: 'background-color 0.2s ease',
              }}
            >
              <ListItemText
                primary={
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 600,
                    }}
                  >
                    {word}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="body2" paragraph sx={{ mb: 1 }}>
                      {definition}
                    </Typography>
                    {examples && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          fontStyle: 'italic',
                          fontSize: '0.8125rem',
                        }}
                      >
                        Example: {examples}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Drawer>
  );
};

export default GlossaryPanel;
