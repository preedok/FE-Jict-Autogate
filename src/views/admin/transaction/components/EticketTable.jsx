import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import QRCodeSVG from 'qrcode.react';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import ReplayIcon from '@mui/icons-material/Replay';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const EticketTable = ({ qrCodes, handleRetry, deleteQRCode, handleSaveEticket, isLoadingSaving, openSnackbar, snackbarMessage, snackbarSeverity, handleSnackbarClose }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fullText, setFullText] = useState('');

  const handleOpenDialog = (text) => {
    setFullText(text);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFullText('');
  };

  return (
    <TabPanel value="eticket">
      <div className="mx-auto p-6">
        <div className="mb-8">
          <QRScanner onScan={handleQRScan} />
          <table style={{ maxHeight: '200px', overflowY: 'auto' }} className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th style={{ width: '120px' }} className="border">QR Image</th>
                <th style={{ width: '600px' }} className="border p-2">E-Ticket</th>
                <th style={{ width: '600px' }} className="border p-2">Decoded Data</th>
                <th style={{ width: '100px' }} className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {qrCodes.map((qrCode) => (
                <tr key={qrCode.id}>
                  <td className="border p-3 justify-center flex">
                    <QRCodeSVG value={qrCode.url} size={48} />
                  </td>
                  <td className="border p-2">
                    <p className="justify-center flex hover:underline">{qrCode.url}</p>
                  </td>
                  <td className="border p-2 text-center">
                    {qrCode.isLoading ? (
                      <CircularProgress size={24} />
                    ) : qrCode.scanError ? (
                      <Alert severity="error" style={{ justifyContent: 'center' }}>
                        {qrCode.errorMessage}
                      </Alert>
                    ) : (
                      <p
                        className="hover:underline cursor-pointer"
                        onClick={() => handleOpenDialog(`${qrCode.decodedData.eticketId || ''} | ${qrCode.decodedData.cntrId || ''} | ${qrCode.decodedData.cntrStatus || ''}`)}
                      >
                        {`${qrCode.decodedData.eticketId || ''} | ${qrCode.decodedData.cntrId || ''} | ${qrCode.decodedData.cntrStatus || ''}`.length > 20
                          ? `${`${qrCode.decodedData.eticketId || ''} | ${qrCode.decodedData.cntrId || ''} | ${qrCode.decodedData.cntrStatus || ''}`.substring(0, 20)}...`
                          : `${qrCode.decodedData.eticketId || ''} | ${qrCode.decodedData.cntrId || ''} | ${qrCode.decodedData.cntrStatus || ''}`}
                      </p>
                    )}
                  </td>
                  <td className="border p-2 text-center">
                    {qrCode.scanError ? (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleRetry(qrCode.id)}
                      >
                        <ReplayIcon /> Retry
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => deleteQRCode(qrCode.id)}
                        disabled={qrCode.isLoading}
                      >
                        <DeleteForeverIcon /> Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ position: 'absolute' }}>
          <Button
            variant="contained"
            style={{ backgroundColor: '#7752FE', width: '30%' }}
            color="primary"
            size="small"
            onClick={handleSaveEticket}
            disabled={isLoadingSaving}
          >
            {isLoadingSaving ? (
              <>
                <CircularProgress size={24} color="inherit" style={{ marginRight: '8px' }} />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </div>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>QR Data</DialogTitle>
        <DialogContent>
          <p>{fullText}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </TabPanel>
  );
};

export default EticketTable;
