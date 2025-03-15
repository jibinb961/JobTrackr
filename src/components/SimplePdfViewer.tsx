import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface SimplePdfViewerProps {
  pdfData: string;
}

const SimplePdfViewer: React.FC<SimplePdfViewerProps> = ({ pdfData }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Clean up any previous blob URLs
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }

    if (pdfData) {
      setLoading(true);
      setError(null);

      try {
        console.log('Processing PDF data...');
        
        // Extract the base64 data
        let base64Data = pdfData;
        if (base64Data.includes('base64,')) {
          base64Data = base64Data.split('base64,')[1];
        }
        
        // Convert base64 to binary
        const binaryData = atob(base64Data);
        const byteArray = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          byteArray[i] = binaryData.charCodeAt(i);
        }
        
        // Create a blob and URL
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        
        // Set a timeout to ensure the iframe has time to load
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (e) {
        console.error('Error processing PDF data:', e);
        setError('Failed to process PDF data');
        setLoading(false);
      }
    }

    // Cleanup function
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [pdfData]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!blobUrl) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography>No PDF data available</Typography>
      </Box>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      src={blobUrl}
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
      }}
      title="PDF Viewer"
    />
  );
};

export default SimplePdfViewer; 