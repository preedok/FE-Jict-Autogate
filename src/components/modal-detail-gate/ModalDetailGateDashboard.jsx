import React, { useState } from "react";
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
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Oval } from "react-loader-spinner";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ImageNoneDamageIcon from '@mui/icons-material/ImageNotSupported';
import ImageDamageIcon from '@mui/icons-material/BrokenImage';
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
const ModalDetailGateDashboard = ({ open, handleClose, data, gateName, refreshEnabled, handleRefreshChange, loading }) => {
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

    const renderImage = (deviceName, height, width, imgPercentage, aPercentage) => {
        let image = null;
        data?.ocrImages.forEach(ocrImage => {
            if (ocrImage.deviceName.toLowerCase() === deviceName.toLowerCase()) {
                image = ocrImage;
                return;
            }
        });
        const imageUrl = image ? `${apiUrl}/OCRData/image/${image.ocrDataId}?percentage=${imgPercentage}` : notfound;
        const hasText = image && image.deviceName.indexOf(deviceName) !== -1
        const timeCreated = image ? formatDate(image.timeCreated) : null;
        const token = isAuth()
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        return (
            <div className="relative">
                <span className="absolute top-0 left-0 px-2 py-1" style={{ backgroundColor: "rgba(255, 255, 255, 0.5)", color: "black" }}>
                    {deviceName.toUpperCase()} - {timeCreated}
                </span>
                {(!image || !hasText) ? (
                    <Tooltip title={'Image Not Found' + " " + deviceName.toUpperCase()} placement="top" sx={{ backgroundColor: 'red !important', color: 'white' }}>
                        <a href={image ? `${apiUrl}/OCRData/image/${image.ocrDataId}?percentage=${aPercentage}` : null} target="_blank" rel="noopener noreferrer" headers={headers}>
                            <div style={{ height, width }}>
                                <img
                                    style={{ objectFit: "cover", height, width }}
                                    src={imageUrl}
                                    alt={image ? `Slide for ${deviceName}` : "Slide not found"}
                                    headers={headers}
                                />
                            </div>
                        </a>
                    </Tooltip>
                ) : (
                    <a href={image ? `${apiUrl}/OCRData/image/${image.ocrDataId}?percentage=${aPercentage}` : null} target="_blank" rel="noopener noreferrer" headers={headers}>
                        <div style={{ height, width }}>
                            <img
                                style={{ objectFit: "cover", height, width }}
                                src={imageUrl}
                                alt={image ? `Slide for ${deviceName}` : "Slide not found"}
                                headers={headers}
                            />
                        </div>
                    </a>
                )}
            </div>
        );
    };

    const [value, setValue] = useState('nonDamage');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [valueocrDevice, setValueocrdevice] = useState('all');
    const handleChangeOcrDevice = (event, newValue) => {
        setValueocrdevice(newValue);
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
                    <Tooltip title={`Auto Refresh ${gateName}`} arrow>
                        <FormControlLabel
                            control={<Switch size="small" checked={refreshEnabled} onChange={handleRefreshChange} />}
                            className='text-white'
                        />
                    </Tooltip>
                    <Typography sx={{ fontSize: '21px', fontWeight: "600", marginLeft: "8px" }}>
                        <ReceiptLongIcon sx={{ marginTop: "-4px", fontSize: '21px' }} /> {data?.gateName} : TRANSACTION INFO
                        <span className='ms-5 text-green-800' style={{ fontWeight: '600' }}>{formatDate(data?.associatedOCRData?.timeCreated)}</span>
                    </Typography>
                </div>
                <IconButton
                    sx={{ position: "absolute", top: 5, right: 5, fontWeight: '600', color: 'red' }}
                    onClick={handleClose}
                    aria-label="close"
                >
                    <CancelIcon color="error" fontSize='large' />
                </IconButton>

                {data && (
                    <div className="mt-5">

                        <div className="flex flex-col gap-2 md:flex-row">
                            <Box sx={{ width: '100%', typography: 'body1', marginRight: '100px' }}>
                                <TabContext value={value}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                                            <Tab icon={<ImageNoneDamageIcon />} value="nonDamage" />
                                            <Tab icon={<ImageDamageIcon />} value="damage" />
                                        </TabList>
                                    </Box>
                                    <TabPanel value="nonDamage">
                                        <div className="flex flex-col gap-2 md:flex-row">
                                            <div className="flex flex-col gap-1 md:flex md:flex-col">
                                                {renderImage(gateName + "-Top", "120px", "610px", 30, 100)}
                                                {renderImage(gateName + "-Right", "120px", "610px", 30, 100)}
                                                {renderImage(gateName + "-Left", "120px", "610px", 30, 100)}
                                            </div>
                                            <div className="flex flex-col gap-1 md:flex md:flex-col">
                                                {renderImage(gateName + "-Rear", "244px", "300px", 30, 100)}
                                                {renderImage(gateName + "-RearZoom", "120px", "300px", 30, 100)}
                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel value="damage">
                                        <div className="flex flex-col gap-2 md:flex-row">
                                            <div className="flex flex-col gap-1 md:flex md:flex-col">
                                                {renderImage(gateName + "-TopDamage", "120px", "610px", 30, 100)}
                                                {renderImage(gateName + "-RightDamage", "120px", "610px", 30, 100)}
                                                {renderImage(gateName + "-LeftDamage", "120px", "610px", 30, 100)}
                                            </div>
                                            <div className="flex flex-col gap-1 md:flex md:flex-col">
                                                {renderImage(gateName + "-RearDamage", "366px", "300px", 40, 100)}
                                            </div>
                                        </div>
                                    </TabPanel>
                                </TabContext>
                            </Box>
                            <div className="flex flex-col ms-auto">
                                <CardHeader
                                    variant="gradient"
                                    style={{ backgroundColor: '#2c3e50', width: '100%', maxWidth: 500 }}
                                    className="grid h-30 mt-2 place-items-center"
                                >
                                    <div className='flex items-center'>
                                        <Typography className='flex gap-3 p-2' color="white" >
                                            {loading ? (
                                                <Oval
                                                    height={23}
                                                    width={23}
                                                    color="#ffff"
                                                    wrapperStyle={{}}
                                                    wrapperClass=""
                                                    visible={true}
                                                    ariaLabel='oval-loading'
                                                    secondaryColor="#4fa94d"
                                                    strokeWidth={2}
                                                    strokeWidthSecondary={2}

                                                />
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                                </svg>
                                            )}

                                            <span sx={{ fontSize: '7px' }}>DETAIL INFORMATION</span>
                                        </Typography>
                                    </div>
                                </CardHeader>
                                <Table className="mt-2 ms-4 w-full" style={{ border: '2px solid black', width: '100%', maxWidth: 427 }}>
                                    <TableBody sx={{ backgroundColor: "#F9FAFC" }}>
                                        <TableRow>
                                            <TableCell >
                                                AXLE TRUCK
                                            </TableCell>
                                            <TableCell align="right">
                                                {data?.associatedOCRData?.axleCount ? data?.associatedOCRData?.axleCount : '-'}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>CHASSIS LENGTH</TableCell>
                                            <TableCell align="right">{data?.associatedOCRData?.chassisLength ? data?.associatedOCRData?.chassisLength : '-'}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <Table className="mt-2 ms-4 w-full" style={{ border: '2px solid black', width: '100%', maxWidth: 427 }}>
                                    <TableBody sx={{ backgroundColor: "#F9FAFC" }}>
                                        <TableRow>
                                            <TableCell >
                                                TAG NR
                                            </TableCell>
                                            <TableCell align="right" >
                                                {data?.associatedOCRData?.tagNumber ? data?.associatedOCRData?.tagNumber : '-'}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell >
                                                WEIGHT
                                            </TableCell>
                                            <TableCell align="right">
                                                {data?.gateWeight}
                                            </TableCell>
                                        </TableRow>
                                        {/* <TableRow>
                                            <TableCell>PLAT NR</TableCell>
                                            <TableCell align="right">{data?.associatedOCRData?.platNo ? data?.associatedOCRData?.platNo : '-'}</TableCell>
                                        </TableRow> */}
                                        <TableRow>
                                            <TableCell>TRANSACTION PLAT NR</TableCell>
                                            <TableCell align="right">{data?.associatedOCRData?.transactionPlatNo ? data?.associatedOCRData?.transactionPlatNo : '-'}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                        <div>
                            <Box sx={{ width: '100%', typography: 'body1', marginRight: '100px' }}>
                                <TabContext value={valueocrDevice}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList onChange={handleChangeOcrDevice} aria-label="lab API tabs example">
                                            <Tab label="ALL" value="all" />
                                            <Tab label="LEFT" value="left" />
                                            <Tab label="TOP" value="top" />
                                            <Tab label="RIGHT" value="right" />
                                            <Tab label="REAR" value="rear" />
                                        </TabList>
                                    </Box>
                                    <TabPanel value="all">
                                        <div className='flex gap-3'>
                                            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                                <TableContainer sx={{ maxHeight: 440 }}>
                                                    <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                        <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                                            <TableRow>
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>OCR</TableCell>
                                                                <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>TRANSACTION</TableCell>
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {data && (
                                                                <>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {data?.associatedOCRData?.container}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {data.associatedOCRData && data.associatedOCRData.transactionContainer ? data.associatedOCRData.transactionContainer : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>ISO CODE</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {data.associatedOCRData && data.associatedOCRData.isoCode ? data.associatedOCRData.isoCode : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {data.associatedOCRData && data.associatedOCRData.transactionIsoCode ? data.associatedOCRData.transactionIsoCode : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>SEAL</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {data.associatedOCRData && data.associatedOCRData.sealPresent ? data.associatedOCRData.sealPresent : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {data.associatedOCRData && data.associatedOCRData.transactionSealPresent ? data.associatedOCRData.transactionSealPresent : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>DG CODE</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {data.associatedOCRData && data.associatedOCRData.dgCode ? data.associatedOCRData.dgCode : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {data.associatedOCRData && data.associatedOCRData.transactionDgCode ? data.associatedOCRData.transactionDgCode : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>MAXGROSS</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {
                                                                                data?.associatedOCRData?.maxGrossWeight > 0
                                                                                    ? data?.associatedOCRData?.maxGrossWeight
                                                                                    : "-"
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {
                                                                                data?.associatedOCRData?.transactionMaxGrossWeight > 0
                                                                                    ? data?.associatedOCRData?.transactionMaxGrossWeight
                                                                                    : "-"
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>PLAT NR</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {data.associatedOCRData && data.associatedOCRData.platNo ? data.associatedOCRData.platNo : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {data.associatedOCRData && data.associatedOCRData.transactionPlatNo ? data.associatedOCRData.ttransactionPlatNo : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
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
                                                                <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>TRANSACTION</TableCell>
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {data && (
                                                                <>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER2</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {data.associatedOCRData && data.associatedOCRData.container2 ? data.associatedOCRData.container2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {data.associatedOCRData && data.associatedOCRData.transactionContainer2 ? data.associatedOCRData.transactionContainer2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>ISO CODE2</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {data.associatedOCRData && data.associatedOCRData.isoCode2 ? data.associatedOCRData.isoCode2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {data.associatedOCRData && data.associatedOCRData.transactionIsoCode2 ? data.associatedOCRData.transactionIsoCode2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>SEAL2</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {data.associatedOCRData && data.associatedOCRData.sealPresent2 ? data.associatedOCRData.sealPresent2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {data.associatedOCRData && data.associatedOCRData.transactionSealPresent2 ? data.associatedOCRData.transactionSealPresent2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>DG CODE2</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {data.associatedOCRData && data.associatedOCRData.dgCode2 ? data.associatedOCRData.dgCode2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {data.associatedOCRData && data.associatedOCRData.transactionDgCode2 ? data.associatedOCRData.transactionDgCode2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>MAXGROSS2</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {
                                                                                data?.associatedOCRData?.maxGrossWeight2 > 0
                                                                                    ? data?.associatedOCRData?.maxGrossWeight2
                                                                                    : "-"
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {
                                                                                data?.associatedOCRData?.transactionMaxGrossWeight2 > 0
                                                                                    ? data?.associatedOCRData?.transactionMaxGrossWeight2
                                                                                    : "-"
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                </>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Paper>
                                            {data?.associatedOCRData?.flatRackBundle && data.associatedOCRData.flatRackBundle.length > 0 ? (
                                                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                                    <TableContainer sx={{ maxHeight: 440 }}>
                                                        <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                            <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                                                <TableRow>
                                                                    {/* <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell> */}
                                                                    <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>FLAT TRACK</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {data.associatedOCRData.flatRackBundle && data.associatedOCRData.flatRackBundle.map((bundle, index) => (
                                                                    <React.Fragment key={index} >
                                                                        <TableRow>
                                                                            {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '6px', width:'400px' }}>NO.CONTAINER{index + 1}|ISO CODE{index + 1}</TableCell> */}
                                                                            <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '6px' }} className="container">
                                                                                {bundle.container} | {bundle.isoCode}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </React.Fragment>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Paper>
                                            ) : null}
                                        </div>
                                    </TabPanel>
                                    <TabPanel value="left" >
                                        <div className='flex gap-3'>
                                            <Paper sx={{ width: '100%', maxWidth: '700px', overflow: 'hidden' }}>
                                                <TableContainer sx={{ maxHeight: 440 }}>
                                                    <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                        <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                                            <TableRow>
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>CONTAINER </TableCell>
                                                                {/* <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>CONTAINER 2</TableCell> */}
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {data && (
                                                                <>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {/* {data.ocrDatas && data?.ocrDatas[1]?.container ? data?.ocrDatas[1]?.container : '-'} */}
                                                                            {data && data?.containerLeft ? data?.containerLeft : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                          
                                                                            {data && data?.containerLeft2 ? data?.containerLeft2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>ISO CODE</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {/* {data.ocrDatas && data?.ocrDatas[1]?.isoCode ? data?.ocrDatas[1]?.isoCode : '-'} */}
                                                                            {data && data?.isoCodeLeft ? data?.isoCodeLeft : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                          
                                                                            {data && data?.isoCodeLeft2 ? data?.isoCodeLeft2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>SEAL</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {/* {data.ocrDatas && data?.ocrDatas[1]?.sealPresent ? data?.ocrDatas[1]?.sealPresent : '-'} */}
                                                                            {data && data?.sealPresentLeft ? data?.sealPresentLeft : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                           
                                                                            {data && data?.sealPresentLeft2 ? data?.sealPresentLeft2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>DG CODE</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {/* {data.ocrDatas && data?.ocrDatas[1]?.dgCode ? data?.ocrDatas[1]?.dgCode : '-'} */}
                                                                            {data && data?.dgCodeLeft ? data?.dgCodeLeft : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                         
                                                                            {data && data?.dgCodeLeft2 ? data?.dgCodeLeft2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>MAXGROSS</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >

                                                                            {/* {
                                                                                data?.ocrDatas[1]?.maxGrossWeight > 0
                                                                                    ? data?.ocrDatas[1]?.maxGrossWeight
                                                                                    : "-"
                                                                            } */}
                                                                            {/* {data && data?.ocrDatas[1]?.maxGrossWeight ? data?.ocrDatas[1]?.maxGrossWeight : '-'} */}
                                                                            {data && data?.maxGrossWeightLeft ? data?.maxGrossWeightLeft : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                           
                                                                            {data && data?.maxGrossWeightLeft2 ? data?.maxGrossWeightLeft2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                </>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Paper>

                                            {data && data.ocrDatas && data.ocrDatas[1] && data.ocrDatas[1].flatRackBundle && data.ocrDatas[1].flatRackBundle.length > 0 ? (
                                                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                                    <TableContainer sx={{ maxHeight: 440 }}>
                                                        <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                            <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                                                <TableRow>
                                                                    {/* <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell> */}
                                                                    <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>FLAT TRACK</TableCell>
                                                                    {/* <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell> */}
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>

                                                                {data.ocrDatas[1].flatRackBundle && data.ocrDatas[1].flatRackBundle.map((bundle, index) => (
                                                                    <React.Fragment key={index} >
                                                                        <TableRow>
                                                                            {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER{index + 1} :</TableCell> */}
                                                                            <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '6px' }} className="container">
                                                                                {bundle.container} | {bundle.isoCode}
                                                                            </TableCell>
                                                                            {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell> */}
                                                                        </TableRow>
                                                                    </React.Fragment>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Paper>
                                            ) : null}
                                        </div>
                                    </TabPanel>
                                    <TabPanel value="top" >
                                        <div className='flex gap-3'>
                                            <Paper sx={{ width: '100%', maxWidth: '700px', overflow: 'hidden' }}>
                                                <TableContainer sx={{ maxHeight: 440 }}>
                                                    <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                        <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                                            <TableRow>
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>CONTAINER </TableCell>
                                                                {/* <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>CONTAINER 2</TableCell> */}
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {data && (
                                                                <>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {/* {data.ocrDatas && data?.ocrDatas[3]?.container ? data?.ocrDatas[3]?.container : '-'} */}
                                                                            {data && data?.containerTop ? data?.containerTop : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                           
                                                                            {data && data?.containerTop2 ? data?.containerTop2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>ISO CODE</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {/* {data.ocrDatas && data?.ocrDatas[3]?.isoCode ? data?.ocrDatas[3]?.isoCode : '-'} */}
                                                                            {data && data?.isoCodeTop ? data?.isoCodeTop : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                           
                                                                            {data && data?.isoCodeTop2 ? data?.isoCodeTop2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>SEAL</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {/* {data.ocrDatas && data?.ocrDatas[3]?.sealPresent ? data?.ocrDatas[3]?.sealPresent : '-'} */}
                                                                            {data && data?.sealPresentTop ? data?.sealPresentTop : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            
                                                                            {data && data?.sealPresentTop2 ? data?.sealPresentTop2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>DG CODE</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {/* {data.ocrDatas && data?.ocrDatas[3]?.dgCode ? data?.ocrDatas[3]?.dgCode : '-'} */}
                                                                            {data && data?.dgCodeTop ? data?.dgCodeTop : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                        
                                                                            {data && data?.dgCodeTop2 ? data?.dgCodeTop2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>MAXGROSS</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {/* {data && data?.ocrDatas[3]?.maxGrossWeight ? data?.ocrDatas[3]?.maxGrossWeight : '-'} */}
                                                                            {data && data?.maxGrossWeightTop ? data?.maxGrossWeightTop : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                          
                                                                            {data && data?.maxGrossWeightTop2 ? data?.maxGrossWeightTop2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                </>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Paper>

                                            {data && data.ocrDatas && data.ocrDatas[3] && data.ocrDatas[3].flatRackBundle && data.ocrDatas[3].flatRackBundle.length > 0 ? (
                                                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                                    <TableContainer sx={{ maxHeight: 440 }}>
                                                        <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                            <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                                                <TableRow>
                                                                    {/* <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell> */}
                                                                    <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>FLAT TRACK</TableCell>
                                                                    {/* <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell> */}
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>

                                                                {data.ocrDatas[3].flatRackBundle && data.ocrDatas[3].flatRackBundle.map((bundle, index) => (
                                                                    <React.Fragment key={index} >
                                                                        <TableRow>
                                                                            {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER{index + 1} :</TableCell> */}
                                                                            <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '6px' }} className="container">
                                                                                {bundle.container} | {bundle.isoCode}
                                                                            </TableCell>
                                                                            {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell> */}
                                                                        </TableRow>
                                                                    </React.Fragment>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Paper>
                                            ) : null}
                                        </div>
                                    </TabPanel>
                                    <TabPanel value="right" >
                                        <div className='flex gap-3'>
                                            <Paper sx={{ width: '100%', maxWidth: '700px', overflow: 'hidden' }}>
                                                <TableContainer sx={{ maxHeight: 440 }}>
                                                    <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                        <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                                            <TableRow>
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>CONTAINER </TableCell>
                                                                {/* <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>CONTAINER 2</TableCell> */}
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {data && (
                                                                <>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {/* {data.ocrDatas && data?.ocrDatas[2]?.container ? data?.ocrDatas[2]?.container : '-'} */}
                                                                            {data && data?.containerRight ? data?.containerRight : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                          
                                                                            {data && data?.containerRight2 ? data?.containerRight2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>ISO CODE</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {/* {data.ocrDatas && data?.ocrDatas[2]?.isoCode ? data?.ocrDatas[2]?.isoCode : '-'} */}
                                                                            {data && data?.isoCodeRight ? data?.isoCodeRight : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                           
                                                                            {data && data?.isoCodeRight2 ? data?.isoCodeRight2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>SEAL</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {/* {data.ocrDatas && data?.ocrDatas[2]?.sealPresent ? data?.ocrDatas[2]?.sealPresent : '-'} */}
                                                                            {data && data?.sealPresentRight ? data?.sealPresentRight : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                         
                                                                            {data && data?.sealPresentRight2 ? data?.sealPresentRight2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>DG CODE</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {/* {data.ocrDatas && data?.ocrDatas[2]?.dgCode ? data?.ocrDatas[2]?.dgCode : '-'} */}
                                                                            {data && data?.dgCodeRight ? data?.dgCodeRight : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                         
                                                                            {data && data?.dgCodeRight2 ? data?.dgCodeRight2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>MAXGROSS</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >

                                                                            {/* {
                                                                                data?.ocrDatas[2]?.maxGrossWeight > 0
                                                                                    ? data?.ocrDatas[2]?.maxGrossWeight
                                                                                    : "-"
                                                                            } */}
                                                                            {/* {data && data?.ocrDatas[2]?.maxGrossWeight ? data?.ocrDatas[2]?.maxGrossWeight : '-'} */}
                                                                            {data && data?.maxGrossWeightRight ? data?.maxGrossWeightRight : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                           
                                                                            {data && data?.maxGrossWeightRight2 ? data?.maxGrossWeightRight2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                </>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Paper>

                                            {data && data.ocrDatas && data.ocrDatas[2] && data.ocrDatas[2].flatRackBundle && data.ocrDatas[2].flatRackBundle.length > 0 ? (
                                                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                                    <TableContainer sx={{ maxHeight: 440 }}>
                                                        <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                            <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                                                <TableRow>
                                                                    {/* <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell> */}
                                                                    <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>FLAT TRACK</TableCell>
                                                                    {/* <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell> */}
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>

                                                                {data.ocrDatas[2].flatRackBundle && data.ocrDatas[2].flatRackBundle.map((bundle, index) => (
                                                                    <React.Fragment key={index} >
                                                                        <TableRow>
                                                                            {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER{index + 1} :</TableCell> */}
                                                                            <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '6px' }} className="container">
                                                                                {bundle.container} | {bundle.isoCode}
                                                                            </TableCell>
                                                                            {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell> */}
                                                                        </TableRow>
                                                                    </React.Fragment>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Paper>
                                            ) : null}
                                        </div>
                                    </TabPanel>
                                    <TabPanel value="rear" >
                                        <div className='flex gap-3'>
                                            <Paper sx={{ width: '100%', maxWidth: '700px', overflow: 'hidden' }}>
                                                <TableContainer sx={{ maxHeight: 440 }}>
                                                    <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                        <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                                            <TableRow>
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>CONTAINER </TableCell>
                                                                {/* <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>CONTAINER 2</TableCell> */}
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {data && (
                                                                <>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {/* {data.ocrDatas && data?.ocrDatas[0]?.container ? data?.ocrDatas[0]?.container : '-'} */}
                                                                            {data && data?.containerRear ? data?.containerRear : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                          
                                                                            {data && data?.containerRear2 ? data?.containerRear2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>ISO CODE</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {/* {data.ocrDatas && data?.ocrDatas[0]?.isoCode ? data?.ocrDatas[0]?.isoCode : '-'} */}
                                                                            {data && data?.isoCodeRear ? data?.isoCodeRear : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                           
                                                                            {data && data?.isoCodeRear2 ? data?.isoCodeRear2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>SEAL</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {/* {data.ocrDatas && data?.ocrDatas[0]?.sealPresent ? data?.ocrDatas[0]?.sealPresent : '-'} */}
                                                                            {data && data?.sealPresentRear ? data?.sealPresentRear : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                           
                                                                            {data && data?.sealPresentRear2 ? data?.sealPresentRear2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>DG CODE</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {/* {data.ocrDatas && data?.ocrDatas[0]?.dgCode ? data?.ocrDatas[0]?.dgCode : '-'} */}
                                                                            {data && data?.dgCodeRear ? data?.dgCodeRear : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                          
                                                                            {data && data?.dgCodeRear2 ? data?.dgCodeRear2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>MAXGROSS</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >

                                                                            {/* {
                                                                                data?.ocrDatas[0]?.maxGrossWeight > 0
                                                                                    ? data?.ocrDatas[0]?.maxGrossWeight
                                                                                    : "-"
                                                                            } */}

                                                                            {/* {data && data?.ocrDatas[0]?.maxGrossWeight ? data?.ocrDatas[0]?.maxGrossWeight : '-'} */}
                                                                            {data && data?.maxGrossWeightRear ? data?.maxGrossWeightRear : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                           
                                                                            {data && data?.maxGrossWeightRear2 ? data?.maxGrossWeightRear2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                </>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Paper>

                                            {data && data.ocrDatas && data.ocrDatas[0] && data.ocrDatas[0].flatRackBundle && data.ocrDatas[0].flatRackBundle.length > 0 ? (
                                                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                                    <TableContainer sx={{ maxHeight: 440 }}>
                                                        <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                            <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                                                <TableRow>
                                                                    {/* <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell> */}
                                                                    <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>FLAT TRACK</TableCell>
                                                                    {/* <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell> */}
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>

                                                                {data.ocrDatas[0].flatRackBundle && data.ocrDatas[0].flatRackBundle.map((bundle, index) => (
                                                                    <React.Fragment key={index} >
                                                                        <TableRow>
                                                                            {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER{index + 1} :</TableCell> */}
                                                                            <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '6px' }} className="container">
                                                                                {bundle.container} | {bundle.isoCode}
                                                                            </TableCell>
                                                                            {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell> */}
                                                                        </TableRow>
                                                                    </React.Fragment>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Paper>
                                            ) : null}
                                        </div>
                                    </TabPanel>
                                </TabContext>
                            </Box>
                        </div>
                    </div>
                )}
            </Box>
        </Modal>
    )
}

export default ModalDetailGateDashboard
