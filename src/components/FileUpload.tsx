import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  useTheme,
  Paper
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Description as FileIcon
} from '@mui/icons-material';
import { Document as DocumentType } from '../types/JobApplication';
import DocumentViewer from './DocumentViewer';

interface FileUploadProps {
  label: string;
  accept: string;
  value?: DocumentType;
  onChange: (document: DocumentType | undefined) => void;
  maxSize?: number; // in MB
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  value,
  onChange,
  maxSize = 5 // Default max size is 5MB
}) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    // Check file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!fileType || !accept.includes(fileType)) {
      setError(`Invalid file type. Accepted types: ${accept}`);
      return;
    }

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        const newDocument: DocumentType = {
          id: Date.now().toString(),
          name: file.name,
          type: fileType === 'pdf' ? 'pdf' : 'docx',
          data: result,
          lastUpdated: new Date().toISOString()
        };
        onChange(newDocument);
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleViewDocument = () => {
    setViewerOpen(true);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}
      </Typography>

      {value ? (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'rgba(142, 68, 173, 0.05)',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FileIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="body2" sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {value.name}
            </Typography>
          </Box>
          <Box>
            <Tooltip title="View">
              <IconButton size="small" onClick={handleViewDocument} sx={{ color: theme.palette.info.main }}>
                <ViewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={handleDelete} sx={{ color: theme.palette.error.main }}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      ) : (
        <Button
          variant="outlined"
          component="label"
          startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
          disabled={loading}
          fullWidth
          sx={{
            p: 1.5,
            borderStyle: 'dashed',
            borderWidth: 1,
            borderColor: theme.palette.divider,
            '&:hover': {
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          {loading ? 'Uploading...' : `Upload ${label}`}
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept={accept}
            onChange={handleFileChange}
            disabled={loading}
          />
        </Button>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
        Accepted formats: {accept}. Max size: {maxSize}MB
      </Typography>

      {value && (
        <DocumentViewer
          document={value}
          open={viewerOpen}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </Box>
  );
};

export default FileUpload; 