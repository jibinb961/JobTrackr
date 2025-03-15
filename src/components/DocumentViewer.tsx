import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  useTheme,
  Button
} from '@mui/material';
import { Close as CloseIcon, Download as DownloadIcon } from '@mui/icons-material';
import { renderAsync } from 'docx-preview';
import SimplePdfViewer from './SimplePdfViewer';

export interface DocumentViewerProps {
  open: boolean;
  onClose: () => void;
  document?: {
    data: string;
    type: string;
    name: string;
  };
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ open, onClose, document }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (open && document) {
      setLoading(true);
      setError(null);
      
      try {
        if (document.type.includes('pdf')) {
          // For PDF files, we'll use SimplePdfViewer
          console.log('Processing PDF document:', document.name);
          // The loading state will be managed by SimplePdfViewer
          setLoading(false);
        } else if (document.type.includes('docx')) {
          // For DOCX files, we use docx-preview
          const container = window.document.getElementById('docx-container');
          if (container) {
            const arrayBuffer = base64ToArrayBuffer(document.data);
            renderAsync(arrayBuffer, container, undefined, {
              ignoreWidth: false,
              ignoreHeight: false,
            })
              .then(() => {
                setLoading(false);
              })
              .catch((err) => {
                console.error('Error rendering DOCX:', err);
                setError('Failed to render DOCX file');
                setLoading(false);
              });
          }
        } else {
          setError('Unsupported file type');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error in document viewer:', err);
        setError('Failed to load document');
        setLoading(false);
      }
    }
  }, [open, document]);

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = window.atob(base64.split(',')[1] || base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const handleDownload = () => {
    if (!document) return;
    
    try {
      // Create a temporary link element
      const link = window.document.createElement('a');
      link.href = document.data;
      link.download = document.name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading document:', err);
    }
  };

  if (!document) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          {document.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {document.type.includes('pdf') && (
            <Button 
              startIcon={<DownloadIcon />} 
              size="small" 
              onClick={handleDownload}
              variant="outlined"
            >
              Download
            </Button>
          )}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, height: '70vh', position: 'relative' }}>
        {loading && !document.type.includes('pdf') && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        )}
        
        {error && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}
        
        {document.type.includes('pdf') ? (
          <SimplePdfViewer pdfData={document.data} />
        ) : (
          <div
            id="docx-container"
            style={{
              width: '100%',
              height: '100%',
              padding: '20px',
              overflow: 'auto',
              display: loading ? 'none' : 'block',
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer; 