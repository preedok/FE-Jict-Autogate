import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Table from "@mui/material/Table";
import { CardHeader } from "@material-tailwind/react";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Paper from '@mui/material/Paper';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import notfound from "../../assets/image-not-found.png";
import CancelIcon from '@mui/icons-material/Cancel';
import Tooltip from "@mui/material/Tooltip";
import { isAuth } from "../../utils/token";
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "98%",
    maxWidth: 3000,
    height: '95%',
    maxHeight: 3000,
    bgcolor: "background.paper",
    overflow: "scroll",
    borderRadius: "10px",
    boxShadow: 24,
    px: 3,
    py: 2
};
const ModalGate = ({ open, handleClose, dataDetail }) => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  
    function formatDate(dateString) {
        if (!dateString) {
            return '-';
        }

        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.error(`Invalid date string: ${dateString}`);
            return '-';
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    const renderImage = (ocrGate, height, width, imgPercentage, aPercentage) => {
        if (typeof dataDetail !== 'object' || dataDetail === null) {
            console.error("dataDetail is not an object. It is:", dataDetail);
            return null;
        }
        const dataArray = [dataDetail];
        const image = dataArray.find(image => image.ocrDevice.indexOf(ocrGate) !== -1);
        if (!image) {
            return null;
        }
        const imageUrl = `${apiUrl}/OCRData/image/${image.id}?percentage=${imgPercentage}`;
        const hasText = image.ocrDevice.indexOf(ocrGate) !== -1
        const timeCreated = image ? formatDate(image.timeCreated) : null;
        const token = isAuth()
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        return (
            <div className="relative">
                <span className="absolute top-0 left-0 px-2 py-1" style={{ backgroundColor: "rgba(255, 255, 255, 0.5)", color: "black" }}>
                    {ocrGate.toUpperCase()} - {timeCreated}
                </span>
                {!hasText ? (
                    <Tooltip color="error" title={'Image Not Found' + " " + ocrGate.toUpperCase()} placement="top" sx={{ backgroundColor: '#B31312', color: 'white' }}>
                        <a href={`${apiUrl}/OCRData/image/${image.id}?percentage=${aPercentage}`} target="_blank" rel="noopener noreferrer" headers={headers}>
                            <div style={{ height, width }}>
                                <img
                                    style={{ objectFit: "cover", height, width }}
                                    src={imageUrl}
                                    alt={`Slide for ${ocrGate}`}
                                    headers={headers}
                                />
                            </div>
                        </a>
                    </Tooltip>
                ) : (
                    <a href={`${apiUrl}/OCRData/image/${image.id}?percentage=${aPercentage}`} target="_blank" rel="noopener noreferrer" headers={headers}>
                        <div style={{ height, width }}>
                            <img
                                style={{ objectFit: "cover", height, width }}
                                src={imageUrl}
                                alt={`Slide for ${ocrGate}`}
                                headers={headers}
                            />
                        </div>
                    </a>
                )}
            </div>
        );
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            fullWidth={true}
            fullScreen={true}
            maxWidth="xl"
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="w-full modal-container"
        >
            <Box sx={style}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '21px', fontWeight: "600", marginLeft: "8px" }}>
                        <ReceiptLongIcon sx={{ marginTop: "-4px", fontSize: '21px' }} /> {dataDetail?.ocrDevice} : OCR DATA INFO
                        <span className='ms-5 text-green-800' style={{ fontWeight: '600' }}>{formatDate(dataDetail?.timeCreated)}</span>
                    </Typography>
                </div>
                <IconButton
                    sx={{ position: "absolute", top: 5, right: 5 }}
                    onClick={handleClose}
                    aria-label="close"
                >
                    <CancelIcon color="error" fontSize='large' />
                </IconButton>
                {dataDetail && (
                    <div className="mt-5">
                        <div className="flex flex-col gap-2 md:flex-row justify-center items-center">
                            <div className="flex flex-col gap-1 md:flex md:flex-col items-center">
                                {renderImage("Top", "100%", "100%", 30, 100)}
                                {renderImage("Right", "100%", "100%",30, 100)}
                                {renderImage("Left", "100%", "100%", 30, 100)}
                                {renderImage("Rear", "244px", "72%", 30, 100)}
                                {renderImage("Zoom", "120px", "72%", 30, 100)}
                            </div>
                        </div>
                        <div className="flex flex-col ms-auto">
                            <CardHeader
                                variant="gradient"
                                style={{ backgroundColor: '#2c3e50' }}
                                className="mb-4 grid h-30 mt-4 place-items-center"
                            >
                                <div className='flex items-center'>
                                    <Typography className='flex gap-3 p-2' color="white" >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                        </svg>
                                        DETAIL INFORMATION
                                    </Typography>
                                </div>
                            </CardHeader>

                            <div className="flex gap-3">
                                <Table className="mt-2 w-full" style={{ border: '2px solid black', width: '100%' }}>
                                    <TableBody sx={{ backgroundColor: "#F9FAFC" }}>
                                        <TableRow>
                                            <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                AXLE TRUCK
                                            </TableCell>
                                            <TableCell align="right" style={{ textAlign: 'right', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                {dataDetail?.axleCount}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CHASSIS LENGHT</TableCell>
                                            <TableCell align="right" style={{ textAlign: 'right', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>{dataDetail?.chassisLength}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <Table className="mt-2 w-full" style={{ border: '2px solid black', width: '100%' }}>
                                    <TableBody sx={{ backgroundColor: "#F9FAFC" }}>
                                        <TableRow>
                                            <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                TAG NR
                                            </TableCell>
                                            <TableCell align="right" style={{ textAlign: 'right', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                {dataDetail?.tagNumber}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell >
                                                WEIGHT
                                            </TableCell>
                                            <TableCell align="right">
                                                {dataDetail?.gateWeight}
                                            </TableCell>
                                        </TableRow>
                                        {/* <TableRow>
                                            <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>PLAT NR</TableCell>
                                            <TableCell align="right" style={{ textAlign: 'right', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>{dataDetail?.platNo}</TableCell>
                                        </TableRow> */}
                                        <TableRow>
                                            <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>TRANSACTION PLAT NR</TableCell>
                                            <TableCell align="right" style={{ textAlign: 'right', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>{dataDetail?.transactionPlatNo}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                        <div className='flex gap-3 mt-3'>
                            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                        <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                            <TableRow>
                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>OCR</TableCell>
                                                {/* <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>TRANSACTION</TableCell> */}

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dataDetail && (
                                                <>
                                                    <TableRow>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER</TableCell>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                            {dataDetail?.container}
                                                        </TableCell>
                                                        {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.transactionContainer ? dataDetail.associatedOCRData.transactionContainer : '-'}
                                                        </TableCell> */}

                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>ISO CODE</TableCell>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                            {dataDetail.isoCode}
                                                        </TableCell>
                                                        {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.transactionIsoCode ? dataDetail.associatedOCRData.transactionIsoCode : '-'}
                                                        </TableCell> */}

                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>SEAL</TableCell>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                            {dataDetail.sealPresent}
                                                        </TableCell>
                                                        {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.transactionSealPresent ? dataDetail.associatedOCRData.transactionSealPresent : '-'}
                                                        </TableCell> */}

                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>DG CODE</TableCell>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                            {dataDetail.dgCode}
                                                        </TableCell>
                                                        {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.transactionDgCode ? dataDetail.associatedOCRData.transactionDgCode : '-'}
                                                        </TableCell> */}

                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>MAXGROSS</TableCell>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                            {dataDetail?.maxGrossWeight}
                                                        </TableCell>
                                                        {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                            {dataDetail?.associatedOCRData?.transactionMaxGrossWeight}
                                                        </TableCell> */}
                                                    </TableRow>
                                                </>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>

                            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                        <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                            <TableRow>
                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>OCR</TableCell>
                                                {/* <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>TRANSACTION</TableCell> */}

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dataDetail && (
                                                <>
                                                    <TableRow>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER</TableCell>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                            {dataDetail?.container2}
                                                        </TableCell>
                                                        {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.transactionContainer ? dataDetail.associatedOCRData.transactionContainer : '-'}
                                                        </TableCell> */}

                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>ISO CODE</TableCell>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                            {dataDetail.isoCode2}
                                                        </TableCell>
                                                        {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.transactionIsoCode ? dataDetail.associatedOCRData.transactionIsoCode : '-'}
                                                        </TableCell> */}

                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>SEAL</TableCell>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                            {dataDetail.sealPresent2}
                                                        </TableCell>
                                                        {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.transactionSealPresent ? dataDetail.associatedOCRData.transactionSealPresent : '-'}
                                                        </TableCell> */}

                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>DG CODE</TableCell>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                            {dataDetail.dgCode2}
                                                        </TableCell>
                                                        {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.transactionDgCode ? dataDetail.associatedOCRData.transactionDgCode : '-'}
                                                        </TableCell> */}

                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>MAXGROSS</TableCell>
                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                            {dataDetail?.maxGrossWeight2}
                                                        </TableCell>
                                                        {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                            {dataDetail?.associatedOCRData?.transactionMaxGrossWeight}
                                                        </TableCell> */}

                                                    </TableRow>
                                                </>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>

                            {dataDetail?.flatRackBundle && dataDetail.flatRackBundle.length > 0 ? (
                                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                    <TableContainer sx={{ maxHeight: 440 }}>
                                        <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                            <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                                <TableRow>
                                                    <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                    <TableCell align="center" style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>FLAT TRACK</TableCell>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                               
                                                {dataDetail.flatRackBundle && (
                                                    <>
                                                        <TableRow>
                                                            <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER</TableCell>
                                                            <TableCell align="right" style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} className="container">
                                                                {dataDetail.container}
                                                            </TableCell>

                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER2</TableCell>
                                                            <TableCell align="right" style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} className="container">
                                                                {dataDetail.container2}
                                                            </TableCell>

                                                        </TableRow>

                                                        <TableRow>
                                                            <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER3</TableCell>
                                                            <TableCell align="right" style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} className="container">
                                                                {dataDetail.container3}
                                                            </TableCell>

                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER4</TableCell>
                                                            <TableCell align="right" style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} className="container">
                                                                {dataDetail.container4}
                                                            </TableCell>

                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER5</TableCell>
                                                            <TableCell align="right" style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} className="container">
                                                                {dataDetail.container5}
                                                            </TableCell>

                                                        </TableRow>
                                                    </>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            ) : null}

                        </div>

                        {/* <div className="mt-5 flex items-end justify-end">
                            <Button
                                variant="contained"
                                type="submit"
                                sx={{ backgroundColor: "#7752FE", height: "W38px", paddingX: '30px' }}
                                onClick={handleClose}
                            >
                                Oke
                            </Button>
                        </div> */}
                    </div>
                )}
            </Box>
        </Modal>
    )
}

export default ModalGate