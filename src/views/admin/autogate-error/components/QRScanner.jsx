import React, { useRef, useState } from 'react';
import { 
  Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, IconButton, Modal, Accordion, AccordionSummary, AccordionDetails, Typography 
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import DeleteIcon from '@mui/icons-material/Delete';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useQRScanner from '../hooks/useQRScanner';

const QRScanner = ({ onScan, scannedCodes = [], onDelete }) => {
    const videoRef = useRef(null);
    const [file, setFile] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const { startScanning, stopScanning, scanImage } = useQRScanner(videoRef, onScan);

    const handleStartCamera = () => {
        stopScanning();
        setShowCamera(true);
        startScanning({ facingMode: 'environment' });
    };

    const handleStopCamera = () => {
        setShowCamera(false);
        stopScanning();
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<CameraAltIcon />}
                    onClick={handleStartCamera}
                    color="primary"
                >
                    Use Camera Scan
                </Button>
            </Box>
            
            <Modal
                open={showCamera}
                onClose={handleStopCamera}
                aria-labelledby="camera-modal-title"
                aria-describedby="camera-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleStopCamera}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <video
                        ref={videoRef}
                        style={{
                            width: '100%',
                            maxWidth: '400px',
                            border: '2px solid #ccc',
                            borderRadius: '8px',
                            transform: 'scaleX(-1)'
                        }}
                    />
                </Box>
            </Modal>
            
        </Box>
    );
};

export default QRScanner;