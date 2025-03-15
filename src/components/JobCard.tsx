import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  useTheme,
  Tooltip
} from '@mui/material';
import { 
  MoreVert as MoreIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  BusinessCenter as BusinessIcon,
  CalendarToday as CalendarIcon,
  FileCopy as ResumeIcon,
  Mail as CoverLetterIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { JobApplication, ApplicationStatus } from '../types/JobApplication';
import DocumentViewer from './DocumentViewer';

interface JobCardProps {
  application: JobApplication;
  onDelete: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ application, onDelete }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<{
    data: string;
    type: string;
    name: string;
  } | null>(null);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleEdit = () => {
    handleMenuClose();
    navigate(`/edit/${application.id}`);
  };
  
  const handleDelete = () => {
    handleMenuClose();
    onDelete(application.id);
  };

  const handleViewDocument = (type: 'resume' | 'coverLetter') => {
    const document = application[type];
    if (document) {
      setCurrentDocument({
        data: document.data,
        type: document.type,
        name: document.name
      });
      setDocumentViewerOpen(true);
    }
  };

  const handleCloseDocumentViewer = () => {
    setDocumentViewerOpen(false);
    setCurrentDocument(null);
  };
  
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPLIED:
        return theme.palette.info.main;
      case ApplicationStatus.INTERVIEW:
        return theme.palette.warning.main;
      case ApplicationStatus.OFFER:
        return theme.palette.success.main;
      case ApplicationStatus.REJECTED:
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card 
        sx={{ 
          borderRadius: 2, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'visible',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            backgroundColor: getStatusColor(application.status),
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {application.jobTitle}
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleMenuOpen}
              sx={{ ml: 1 }}
            >
              <MoreIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleEdit}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <BusinessIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
            <Typography variant="body1" color="text.primary">
              {application.companyName}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
            <Typography variant="body2" color="text.secondary">
              Applied on {formatDate(application.applicationDate)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip 
              label={application.status} 
              size="small"
              sx={{ 
                backgroundColor: getStatusColor(application.status),
                color: '#fff',
                fontWeight: 'bold'
              }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              {application.resume && (
                <Tooltip title="View Resume">
                  <IconButton 
                    size="small" 
                    onClick={() => handleViewDocument('resume')}
                    color="primary"
                  >
                    <ResumeIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {application.coverLetter && (
                <Tooltip title="View Cover Letter">
                  <IconButton 
                    size="small" 
                    onClick={() => handleViewDocument('coverLetter')}
                    color="secondary"
                  >
                    <CoverLetterIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {currentDocument && (
        <DocumentViewer
          open={documentViewerOpen}
          onClose={handleCloseDocumentViewer}
          document={currentDocument}
        />
      )}
    </motion.div>
  );
};

export default JobCard; 