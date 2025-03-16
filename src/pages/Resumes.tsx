import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon, 
  MoreVert as MoreIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  FileCopy as CopyIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useResumes, createDefaultSections } from '../context/ResumeContext';
import { MasterResume } from '../types/Resume';

const Resumes: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { masterResumes, addMasterResume, deleteMasterResume, createResumeCopy } = useResumes();
  
  const [menuAnchorEl, setMenuAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newResumeName, setNewResumeName] = useState('');
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [copyResumeId, setCopyResumeId] = useState<string | null>(null);
  const [copyName, setCopyName] = useState('');
  const [copyPurpose, setCopyPurpose] = useState('');
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, resumeId: string) => {
    setMenuAnchorEl({
      ...menuAnchorEl,
      [resumeId]: event.currentTarget
    });
  };
  
  const handleMenuClose = (resumeId: string) => {
    setMenuAnchorEl({
      ...menuAnchorEl,
      [resumeId]: null
    });
  };
  
  const handleCreateDialogOpen = () => {
    setNewResumeName('');
    setCreateDialogOpen(true);
  };
  
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };
  
  const handleCreateResume = async () => {
    if (newResumeName.trim()) {
      try {
        await addMasterResume({
          name: newResumeName.trim(),
          sections: createDefaultSections()
        });
        setCreateDialogOpen(false);
      } catch (error) {
        console.error('Error creating resume:', error);
      }
    }
  };
  
  const handleEditResume = (resumeId: string) => {
    handleMenuClose(resumeId);
    navigate(`/resumes/edit/${resumeId}`);
  };
  
  const handleDeleteResume = async (resumeId: string) => {
    handleMenuClose(resumeId);
    try {
      await deleteMasterResume(resumeId);
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };
  
  const handleCopyDialogOpen = (resumeId: string) => {
    handleMenuClose(resumeId);
    setCopyResumeId(resumeId);
    const resume = masterResumes.find(r => r.id === resumeId);
    if (resume) {
      setCopyName(`${resume.name} - Copy`);
      setCopyPurpose('');
      setCopyDialogOpen(true);
    }
  };
  
  const handleCopyDialogClose = () => {
    setCopyDialogOpen(false);
    setCopyResumeId(null);
  };
  
  const handleCreateCopy = async () => {
    if (copyResumeId && copyName.trim() && copyPurpose.trim()) {
      try {
        const copyId = await createResumeCopy(copyResumeId, copyPurpose.trim(), copyName.trim());
        setCopyDialogOpen(false);
        navigate(`/resumes/copy/${copyId}`);
      } catch (error) {
        console.error('Error creating resume copy:', error);
      }
    }
  };
  
  const handleDownloadResume = (resume: MasterResume) => {
    // Create a text representation of the resume
    let resumeText = `# ${resume.name}\n\n`;
    
    // Sort sections by order
    const sortedSections = [...resume.sections].sort((a, b) => a.order - b.order);
    
    // Add each section to the text
    sortedSections.forEach(section => {
      resumeText += `## ${section.title}\n${section.content}\n\n`;
    });
    
    // Create a blob and download it
    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resume.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          Resume Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateDialogOpen}
        >
          Create Master Resume
        </Button>
      </Box>
      
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Create and manage your master resume. You can create copies for specific job applications.
      </Typography>
      
      {masterResumes.length === 0 ? (
        <Box 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            bgcolor: 'rgba(0,0,0,0.02)', 
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider'
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No Resumes Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Create your master resume to get started. You can then create tailored copies for specific job applications.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateDialogOpen}
          >
            Create Your First Resume
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {masterResumes.map((resume) => (
            <Grid item xs={12} md={6} key={resume.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card sx={{ 
                  borderRadius: 2, 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        {resume.name}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleMenuOpen(e, resume.id)}
                      >
                        <MoreIcon />
                      </IconButton>
                      <Menu
                        anchorEl={menuAnchorEl[resume.id]}
                        open={Boolean(menuAnchorEl[resume.id])}
                        onClose={() => handleMenuClose(resume.id)}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        <MenuItem onClick={() => handleEditResume(resume.id)}>
                          <ListItemIcon>
                            <EditIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Edit</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handleCopyDialogOpen(resume.id)}>
                          <ListItemIcon>
                            <CopyIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Create Copy</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handleDownloadResume(resume)}>
                          <ListItemIcon>
                            <DownloadIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Download</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => handleDeleteResume(resume.id)}>
                          <ListItemIcon>
                            <DeleteIcon fontSize="small" color="error" />
                          </ListItemIcon>
                          <ListItemText sx={{ color: theme.palette.error.main }}>Delete</ListItemText>
                        </MenuItem>
                      </Menu>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Last updated: {new Date(resume.lastUpdated).toLocaleDateString()}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {resume.sections.length} sections
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      {resume.sections.slice(0, 3).map((section) => (
                        <Box 
                          key={section.id} 
                          sx={{ 
                            bgcolor: 'rgba(142, 68, 173, 0.1)', 
                            px: 1.5, 
                            py: 0.5, 
                            borderRadius: 1,
                            fontSize: '0.75rem'
                          }}
                        >
                          {section.title}
                        </Box>
                      ))}
                      {resume.sections.length > 3 && (
                        <Box 
                          sx={{ 
                            bgcolor: 'rgba(142, 68, 173, 0.05)', 
                            px: 1.5, 
                            py: 0.5, 
                            borderRadius: 1,
                            fontSize: '0.75rem'
                          }}
                        >
                          +{resume.sections.length - 3} more
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      onClick={() => handleEditResume(resume.id)}
                    >
                      Edit Resume
                    </Button>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Create Resume Dialog */}
      <Dialog open={createDialogOpen} onClose={handleCreateDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Master Resume</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Your master resume will contain all your experience, skills, and achievements. 
            You can create copies of it tailored for specific job applications.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Resume Name"
            fullWidth
            variant="outlined"
            value={newResumeName}
            onChange={(e) => setNewResumeName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Cancel</Button>
          <Button 
            onClick={handleCreateResume} 
            variant="contained" 
            disabled={!newResumeName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Create Copy Dialog */}
      <Dialog open={copyDialogOpen} onClose={handleCopyDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create Resume Copy</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create a copy of your master resume that you can customize for a specific job application.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Copy Name"
            fullWidth
            variant="outlined"
            value={copyName}
            onChange={(e) => setCopyName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Purpose (e.g., Company Name or Job Title)"
            fullWidth
            variant="outlined"
            value={copyPurpose}
            onChange={(e) => setCopyPurpose(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyDialogClose}>Cancel</Button>
          <Button 
            onClick={handleCreateCopy} 
            variant="contained" 
            disabled={!copyName.trim() || !copyPurpose.trim()}
          >
            Create Copy
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Resumes; 