import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';

const DecodedDialog = ({ open, onClose, decodedData, autoGateTransactionId }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const renderFields = () => {
    const entries = Object.entries(decodedData).filter(([key]) => key !== 'rawdata');
    return entries.map(([key, value]) => (
      <Grid item xs={12} sm={6} md={4} key={key}>
        <Typography variant="subtitle2" component="span">{key}: </Typography>
        <Typography variant="body2" component="span">
          {value !== null ? value.toString() : ''}
        </Typography>
      </Grid>
    ));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      fullScreen={isSmallScreen}
    >
      <DialogTitle>Decoded Data</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {renderFields()}
        </Grid>
        {decodedData.rawdata && (
          <Typography variant="body2" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: theme.spacing(2) }}>
            <strong>Raw Data:</strong> {decodedData.rawdata}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose} color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DecodedDialog;