import { useState, useCallback } from 'react';
import jsQR from 'jsqr';

const useQRScanner = (videoRef, onScan) => {
    const [stream, setStream] = useState(null);

    const startScanning = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            setStream(mediaStream);
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play();

            const scanCanvas = document.createElement('canvas');
            const scanInterval = setInterval(() => {
                if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                    scanCanvas.height = videoRef.current.videoHeight;
                    scanCanvas.width = videoRef.current.videoWidth;
                    const ctx = scanCanvas.getContext('2d');
                    ctx.drawImage(videoRef.current, 0, 0, scanCanvas.width, scanCanvas.height);
                    const imageData = ctx.getImageData(0, 0, scanCanvas.width, scanCanvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    if (code) {
                        onScan(code.data);
                        clearInterval(scanInterval);
                        stopScanning();
                    }
                }
            }, 100);
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    }, [videoRef, onScan]);

    const stopScanning = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    const scanImage = useCallback((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, img.width, img.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    onScan(code.data);
                } else {
                    console.log('No QR code found in the image');
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }, [onScan]);

    return { startScanning, stopScanning, scanImage };
};

export default useQRScanner;