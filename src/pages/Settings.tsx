import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch
} from '@mui/material';
import {
  DeleteForever as DeleteIcon,
  GetApp as ExportIcon,
  Upload as ImportIcon,
  Backup as BackupIcon,
  DarkMode as DarkModeIcon,
  Notifications as NotificationsIcon,
  DataUsage as DataUsageIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useJobApplications } from '../context/JobApplicationContext';

const Settings: React.FC = () => {
  const theme = useTheme();
  const { applications } = useJobApplications();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // These would be connected to actual functionality in a real app
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  
  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(applications, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `job-applications-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setSnackbarMessage('Data exported successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Failed to export data. Please try again.');
      setSnackbarOpen(true);
    }
  };
  
  const handleImportData = () => {
    // In a real app, this would open a file picker and import the data
    setSnackbarMessage('Import functionality would be implemented in a real app.');
    setSnackbarOpen(true);
  };
  
  const handleBackupData = () => {
    setSnackbarMessage('Backup functionality would be implemented in a real app.');
    setSnackbarOpen(true);
  };
  
  const handleDeleteAllData = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    // In a real app, this would clear all data
    setDeleteDialogOpen(false);
    setSnackbarMessage('All data would be deleted in a real app.');
    setSnackbarOpen(true);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Settings
      </Typography>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ mb: 4 }}>
          <motion.div variants={itemVariants}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Application Data
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ExportIcon />}
                  onClick={handleExportData}
                  sx={{ borderRadius: 2 }}
                >
                  Export Data
                </Button>
                
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ImportIcon />}
                  onClick={handleImportData}
                  sx={{ borderRadius: 2 }}
                >
                  Import Data
                </Button>
                
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<BackupIcon />}
                  onClick={handleBackupData}
                  sx={{ borderRadius: 2 }}
                >
                  Backup Data
                </Button>
                
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteAllData}
                  sx={{ borderRadius: 2 }}
                >
                  Delete All Data
                </Button>
              </Box>
              
              <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                Your data is stored locally in your browser. Exporting your data regularly is recommended to prevent data loss.
              </Alert>
            </Paper>
          </motion.div>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <motion.div variants={itemVariants}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Preferences
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <DarkModeIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Dark Mode" 
                    secondary="Use dark theme throughout the application"
                  />
                  <Switch
                    edge="end"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                    inputProps={{
                      'aria-labelledby': 'dark-mode-switch',
                    }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Notifications" 
                    secondary="Receive reminders about your applications"
                  />
                  <Switch
                    edge="end"
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                    inputProps={{
                      'aria-labelledby': 'notifications-switch',
                    }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <DataUsageIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Auto Backup" 
                    secondary="Automatically backup your data"
                  />
                  <Switch
                    edge="end"
                    checked={autoBackup}
                    onChange={() => setAutoBackup(!autoBackup)}
                    inputProps={{
                      'aria-labelledby': 'auto-backup-switch',
                    }}
                  />
                </ListItem>
              </List>
              
              <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                These settings are for demonstration purposes only and don't affect the application's functionality.
              </Alert>
            </Paper>
          </motion.div>
        </Box>
        
        <Box>
          <motion.div variants={itemVariants}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                About
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="body1" paragraph>
                JobTrackr is a simple job application tracker that helps you keep track of your job search process.
              </Typography>
              
              <Typography variant="body1" paragraph>
                Version: 1.0.0
              </Typography>
              
              <Typography variant="body1" paragraph>
                Created with React, TypeScript, Material UI, and Framer Motion.
              </Typography>
              
              <Typography variant="body1" paragraph>
                All data is stored locally in your browser using localStorage.
              </Typography>
            </Paper>
          </motion.div>
        </Box>
      </motion.div>
      
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete All Data
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete all your job application data? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete All Data
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Settings; 