import React, { useState, useEffect } from "react";
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
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ImageNoneDamageIcon from '@mui/icons-material/ImageNotSupported';
import ImageDamageIcon from '@mui/icons-material/BrokenImage';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Swal from 'sweetalert2';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import api from '../../service/api'
import { Snackbar, Alert } from '@mui/material';
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
const ModalGate = ({ open, handleClose, dataDetail, setDataDetail, handleOpenEditOcr }) => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
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
        const images = dataDetail?.ocrImages ?? [];
        console.log('devicename', deviceName)
        const image = images.find(image => image.deviceName.indexOf(deviceName) !== -1);
        const imageUrl = image ? `${apiUrl}/OCRData/image/${image.ocrDataId}?percentage=${imgPercentage}` : notfound;
        const hasText = image && image.deviceName.indexOf(deviceName) !== -1;
        const timeCreated = image ? formatDate(image.timeCreated) : null;
        const token = isAuth()
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        return (
            <div className="relative">
                <span className="absolute top-0 left-0 px-2 py-1" style={{ backgroundColor: "rgba(255, 255, 255, 0.5)", color: "black" }}>
                    {deviceName.toUpperCase()} - {timeCreated}
                </span>
                {(!image || !hasText) ? (
                    <Tooltip color="error" title={'Image Not Found' + " " + deviceName.toUpperCase()} placement="top" sx={{ backgroundColor: '#B31312', color: 'white' }}>
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
    const [value1, setValue1] = useState('all');
    const handleChange1 = (event, newValue) => {
        setValue1(newValue);
    };


    const [editIndex, setEditIndex] = useState(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');


    const initialSelections = {
        containerAcc: null,
        isoCodeAcc: null,
        sealAcc: null,
        dgCodeAcc: null,
        axleAcc: null
    };

    const [selections, setSelections] = useState(initialSelections);
    useEffect(() => {
        if (open) {
            if (dataDetail && dataDetail.ocrAutogateAccuracy) {
                setSelections({
                    containerAcc: dataDetail.ocrAutogateAccuracy.containerAcc,
                    isoCodeAcc: dataDetail.ocrAutogateAccuracy.isoCodeAcc,
                    sealAcc: dataDetail.ocrAutogateAccuracy.sealAcc,
                    dgCodeAcc: dataDetail.ocrAutogateAccuracy.dgCodeAcc,
                    axleAcc: dataDetail.ocrAutogateAccuracy.axleAcc
                });
            } else {
                setSelections(initialSelections);
            }
        }
    }, [open, dataDetail]);
    const handleIconClick = (field, value) => {
        setSelections(prevSelections => ({
            ...prevSelections,
            [field]: value
        }));
    };


    const handleSaveClick = async () => {
        const id = localStorage.getItem('idAutoGateDetail');
        const data = {
            gateTransactionId: id,
            ...selections
        };
        const token = isAuth();
        try {
            const response = await api.patch(`/GateTransaction/${id}/accuracy`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setSnackbarMessage('Update successful');
            setSnackbarSeverity('success');
        } catch (error) {
            setSnackbarMessage('Error updating data: ' + error.message);
            setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
        setEditIndex(null);
    };


  
    const rows = [
        { label: 'CONTAINER NO', field: 'containerAcc' },
        { label: 'ISO CODE', field: 'isoCodeAcc' },
        { label: 'SEAL PRESENT', field: 'sealAcc' },
        { label: 'DG CODE', field: 'dgCodeAcc' },
        { label: 'AXLE COUNT', field: 'axleAcc' }
    ];


 

    const renderDifferences = () => {
        if (!dataDetail || !dataDetail.firstOCRData || !dataDetail.lastFixOCRData) {
            return null;
        }

        const firstData = dataDetail.firstOCRData;
        const lastData = dataDetail.lastFixOCRData;
        const differences = [];

        const formatKey = (key) => {
            switch (key) {
                case "chassisLength":
                    return "CHASSIS LENGTH";
                case "container2":
                    return "CONTAINER 2";
                case "sealPresent":
                    return "SEAL PRESENT";
                case "sealPresent2":
                    return "SEAL PRESENT 2";
                case "isoCode":
                    return "ISO CODE";
                case "isoCode2":
                    return "ISO CODE 2";
                case "dgCode":
                    return "DG CODE";
                default:
                    return key.toUpperCase();
            }
        };

        Object.keys(firstData).forEach(key => {
            if (["flatRackBundle", "id", "transactionAxleCount", "timeCreated", "username"].includes(key)) {
                return;
            }

            if (lastData.hasOwnProperty(key) && JSON.stringify(firstData[key]) !== JSON.stringify(lastData[key])) {
                const formattedKey = formatKey(key);
                const firstValue = (key === "chassisLength" && firstData[key] === "L") ? "L " : JSON.stringify(firstData[key]) || '-';
                const lastValue = (key === "chassisLength" && lastData[key] === "L") ? "L " : JSON.stringify(lastData[key]) || '-';

                differences.push(
                    <TableRow key={key}>
                        <TableCell style={{ fontWeight: '600', fontSize: '16px' }}>{formattedKey}</TableCell>
                        <TableCell>{firstValue}</TableCell>
                        <TableCell style={{ color: 'red' }}>→</TableCell>
                        <TableCell>{lastValue}</TableCell>
                    </TableRow>
                );
            }
        });

        return differences.length > 0 ? differences : (
            <TableRow>
                <TableCell colSpan={4}>No changes detected.</TableCell>
            </TableRow>
        );
    };
    return (
        <>
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
                            <ReceiptLongIcon sx={{ marginTop: "-4px", fontSize: '21px' }} /> {dataDetail?.gateName} : TRANSACTION INFO
                            <span className='ms-5 text-green-800' style={{ fontWeight: '600' }}>{formatDate(dataDetail?.associatedOCRData?.timeCreated)}</span>

                            {dataDetail?.lastFixOCRData && dataDetail.lastFixOCRData.length > 0 ? (
                                <span className='ms-5 text-black-800' >Last edited by : <b>{dataDetail?.lastFixOCRData?.username ? dataDetail?.lastFixOCRData?.username : '-'}</b> </span>
                            ) : null}

                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ marginLeft: '10px', backgroundColor: "#7752FE", height: "W38px", paddingX: '30px' }}
                            onClick={() => handleOpenEditOcr(localStorage.getItem('idAutoGateDetail'))}
                        >
                            Edit
                        </Button>

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
                            <div className="flex flex-col gap-2 md:flex-row">
                                <Box sx={{ width: '100%', typography: 'body1', marginRight: '100px' }}>
                                    <TabContext value={value}>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                                <Tab icon={<ImageNoneDamageIcon />} value="1" />
                                                <Tab icon={<ImageDamageIcon />} value="2" />
                                            </TabList>
                                        </Box>
                                        <TabPanel value="1">
                                            <div className="flex flex-col gap-2 md:flex-row">
                                                <div className="flex flex-col gap-1 md:flex md:flex-col">
                                                    {renderImage("Top", "120px", "610px", 30, 100)}
                                                    {renderImage("Right", "120px", "610px", 30, 100)}
                                                    {renderImage("Left", "120px", "610px", 30, 100)}
                                                </div>
                                                <div className="flex flex-col gap-1 md:flex md:flex-col">
                                                    {renderImage("Rear", "244px", "300px", 30, 100)}
                                                    {renderImage("Zoom", "120px", "300px", 30, 100)}
                                                </div>
                                            </div>
                                        </TabPanel>
                                        <TabPanel value="2">
                                            <div className="flex flex-col gap-2 md:flex-row">
                                                <div className="flex flex-col gap-1 md:flex md:flex-col">
                                                    {renderImage("TopDamage", "120px", "610px", 30, 100)}
                                                    {renderImage("RightDamage", "120px", "610px", 30, 100)}
                                                    {renderImage("LeftDamage", "120px", "610px", 30, 100)}
                                                </div>
                                                <div className="flex flex-col gap-1 md:flex md:flex-col">
                                                    {renderImage("RearDamage", "366px", "300px", 40, 100)}
                                                </div>
                                            </div>
                                        </TabPanel>
                                    </TabContext>
                                </Box>
                                <div className="flex flex-col ms-auto">
                                    <CardHeader
                                        variant="gradient"
                                        style={{ backgroundColor: '#2c3e50', maxWidth: 400 }}
                                        className="mb-4 grid h-30 mt-4 place-items-center"
                                    >
                                        <div className='flex items-center'>
                                            <Typography className='flex gap-3 p-2' color="white" >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                                </svg>
                                                <span>DETAIL INFORMATION</span>
                                            </Typography>
                                        </div>
                                    </CardHeader>

                                    <Table className="mt-2 w-full" style={{ border: '2px solid black', width: '100%', maxWidth: 427 }}>
                                        <TableBody sx={{ backgroundColor: "#F9FAFC" }}>
                                            <TableRow>
                                                <TableCell >
                                                    AXLE TRUCK
                                                </TableCell>
                                                <TableCell align="right">
                                                    {dataDetail?.associatedOCRData?.transactionAxleCount}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>CHASSIS LENGTH</TableCell>
                                                <TableCell align="right">{dataDetail?.associatedOCRData?.chassisLength}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell >
                                                    CHASSIS TYPE
                                                </TableCell>
                                                <TableCell align="right">
                                                    {dataDetail?.associatedOCRData?.chassisType}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell >
                                                    DOOR DIRECTION
                                                </TableCell>
                                                <TableCell align="right">
                                                    {dataDetail?.associatedOCRData?.doorDirection} |
                                                    {dataDetail?.associatedOCRData?.doorDirection2}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    <Table className="mt-2 w-full" style={{ border: '2px solid black', width: '100%', maxWidth: 427 }}>
                                        <TableBody sx={{ backgroundColor: "#F9FAFC" }}>
                                            <TableRow>
                                                <TableCell >
                                                    TAG NR
                                                </TableCell>
                                                <TableCell align="right">
                                                    {dataDetail?.associatedOCRData?.transactionTagNumber}
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
                                                <TableCell >PLAT NR</TableCell>
                                                <TableCell align="right">{dataDetail?.associatedOCRData?.platNo}</TableCell>
                                            </TableRow> */}
                                            <TableRow>
                                                <TableCell >TRANSACTION PLAT NO</TableCell>
                                                <TableCell align="right">{dataDetail?.associatedOCRData?.transactionPlatNo}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>

                                </div>
                            </div>


                            <Box sx={{ width: '100%', typography: 'body1', marginRight: '100px' }}>
                                <TabContext value={value1}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList onChange={handleChange1} aria-label="lab API tabs example">
                                            <Tab label="ALL" value="all" />
                                            <Tab label="LEFT" value="left" />
                                            {/* <Tab label="TOP" value="top" /> */}
                                            <Tab label="RIGHT" value="right" />
                                            <Tab label="REAR" value="rear" />

                                            {localStorage.getItem('role') === 'AUDITOR' && (
                                                <Tab label="ACCURACY" value="accuracy" />
                                            )}
                                            {/* {dataDetail?.lastFixOCRData !== null && (
                                                <Tab label="EDITED" value="edited" />
                                            )} */}

                                            {dataDetail.lastFixOCRData && <Tab label="EDITED" value="edited" />}
                                        </TabList>
                                    </Box>
                                    <TabPanel value="all" >
                                        <div className='flex gap-3'>
                                            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                                <TableContainer sx={{ maxHeight: 440 }}>
                                                    <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                        <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                                            <TableRow>
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '16px', padding: '8px' }}>OCR</TableCell>
                                                                <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '16px', padding: '8px' }}>TRANSACTION</TableCell>
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {dataDetail && (
                                                                <>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>CONTAINER</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >
                                                                            {dataDetail?.associatedOCRData?.container}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >
                                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.transactionContainer ? dataDetail.associatedOCRData.transactionContainer : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>ISO CODE</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >
                                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.isoCode ? dataDetail.associatedOCRData.isoCode : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>
                                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.transactionIsoCode ? dataDetail.associatedOCRData.transactionIsoCode : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>SEAL</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >
                                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.sealPresent ? dataDetail.associatedOCRData.sealPresent : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >
                                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.transactionSealPresent ? dataDetail.associatedOCRData.transactionSealPresent : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>DG CODE</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>
                                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.dgCode ? dataDetail.associatedOCRData.dgCode : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>
                                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.transactionDgCode ? dataDetail.associatedOCRData.transactionDgCode : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>MAXGROSS</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >
                                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.maxGrossWeight ? dataDetail.associatedOCRData.maxGrossWeight : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >
                                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.transactionMaxGrossWeight ? dataDetail.associatedOCRData.transactionMaxGrossWeight : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    {/* <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>PLAT NR</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.platNo ? dataDetail.associatedOCRData.platNo : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.transactionPlatNo ? dataDetail.associatedOCRData.ttransactionPlatNo : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow> */}
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
                                                                <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '16px', padding: '8px' }}>OCR</TableCell>
                                                                <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '16px', padding: '8px' }}>TRANSACTION</TableCell>
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {dataDetail && (
                                                                <>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>CONTAINER2</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >
                                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.container2 ? dataDetail.associatedOCRData.container2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>
                                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.transactionContainer2 ? dataDetail.associatedOCRData.transactionContainer2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>ISO CODE2</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>
                                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.isoCode2 ? dataDetail.associatedOCRData.isoCode2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>
                                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.transactionIsoCode2 ? dataDetail.associatedOCRData.transactionIsoCode2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>SEAL2</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >
                                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.sealPresent2 ? dataDetail.associatedOCRData.sealPresent2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>
                                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.transactionSealPresent2 ? dataDetail.associatedOCRData.transactionSealPresent2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>DG CODE2</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >
                                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.dgCode2 ? dataDetail.associatedOCRData.dgCode2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >
                                                                            {dataDetail.associatedOCRData && dataDetail.associatedOCRData.transactionDgCode2 ? dataDetail.associatedOCRData.transactionDgCode2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>MAXGROSS2</TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>
                                                                            {
                                                                                dataDetail?.associatedOCRData?.maxGrossWeight2 > 0
                                                                                    ? dataDetail?.associatedOCRData?.maxGrossWeight2
                                                                                    : "-"
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >
                                                                            {
                                                                                dataDetail?.associatedOCRData?.transactionMaxGrossWeight2 > 0
                                                                                    ? dataDetail?.associatedOCRData?.transactionMaxGrossWeight2
                                                                                    : "-"
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                </>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Paper>
                                            {dataDetail?.associatedOCRData?.flatRackBundle && dataDetail.associatedOCRData.flatRackBundle.length > 0 ? (
                                                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                                    <TableContainer sx={{ maxHeight: 440 }}>
                                                        <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                            <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                                                <TableRow>
                                                                    <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '16px', padding: '8px' }}>FLAT TRACK</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {dataDetail.associatedOCRData.flatRackBundle.map((bundle, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '6px' }}>
                                                                            {bundle.container} | {bundle.isoCode}
                                                                        </TableCell>
                                                                    </TableRow>
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
                                            <Paper sx={{ width: '100%', maxWidth: '400px', overflow: 'hidden' }}>
                                                <TableContainer sx={{ maxHeight: 440 }}>
                                                    <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                        <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                                            <TableRow>
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '16px', padding: '8px' }}>CONTAINER </TableCell>
                                                                {/* <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>CONTAINER 2</TableCell> */}
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {dataDetail && (
                                                                <>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>CONTAINER</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >
                                                                            {dataDetail && dataDetail?.containerLeft ? dataDetail?.containerLeft : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>   {dataDetail.ocrDatas && dataDetail?.ocrDatas[1]?.container2 ? dataDetail?.ocrDatas[1]?.container2 : '-'}</TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>ISO CODE</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >
                                                                            {dataDetail && dataDetail?.isoLeft ? dataDetail?.isoLeft : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {dataDetail.ocrDatas && dataDetail?.ocrDatas[1]?.isoCode2 ? dataDetail?.ocrDatas[1]?.isoCode2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    {/* <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>SEAL</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {dataDetail.ocrDatas && dataDetail?.ocrDatas[1]?.sealPresent ? dataDetail?.ocrDatas[1]?.sealPresent : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {dataDetail.ocrDatas && dataDetail?.ocrDatas[1]?.sealPresent2 ? dataDetail?.ocrDatas[1]?.sealPresent2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow> */}
                                                                    {/* <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>DG CODE</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {dataDetail.ocrDatas && dataDetail?.ocrDatas[1]?.dgCode ? dataDetail?.ocrDatas[1]?.dgCode : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {dataDetail.ocrDatas && dataDetail?.ocrDatas[1]?.dgCode2 ? dataDetail?.ocrDatas[1]?.dgCode2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow> */}
                                                                    {/* <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>MAXGROSS</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >

                                                                            {
                                                                                dataDetail.ocrDatas && dataDetail?.ocrDatas[1]?.maxGrossWeight > 0
                                                                                    ? dataDetail?.ocrDatas[1]?.maxGrossWeight
                                                                                    : "-"
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {
                                                                                dataDetail.ocrDatas && dataDetail?.ocrDatas[1]?.maxGrossWeight2 > 0
                                                                                    ? dataDetail?.ocrDatas[1]?.maxGrossWeight2
                                                                                    : "-"
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow> */}
                                                                </>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Paper>

                                            {dataDetail && dataDetail.ocrDatas && dataDetail.ocrDatas[1] && dataDetail.ocrDatas[1].flatRackBundle && dataDetail.ocrDatas[1].flatRackBundle.length > 0 ? (
                                                <Paper sx={{ width: '100%', overflow: 'hidden', maxWidth: '400px', }}>
                                                    <TableContainer sx={{ maxHeight: 440 }}>
                                                        <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                            <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                                                <TableRow>
                                                                    {/* <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell> */}
                                                                    <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '16px', padding: '8px' }}>FLAT TRACK</TableCell>
                                                                    {/* <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell> */}
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>

                                                                {dataDetail.ocrDatas[1].flatRackBundle && dataDetail.ocrDatas[1].flatRackBundle.map((bundle, index) => (
                                                                    <React.Fragment key={index} >
                                                                        <TableRow>
                                                                            {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER{index + 1} :</TableCell> */}
                                                                            <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '6px' }} className="container">
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
                                            <Paper sx={{ width: '100%', maxWidth: '400px', overflow: 'hidden' }}>
                                                <TableContainer sx={{ maxHeight: 440 }}>
                                                    <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                        <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                                            <TableRow>
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '16px', padding: '8px' }}>CONTAINER </TableCell>
                                                                {/* <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>CONTAINER 2</TableCell> */}
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {dataDetail && (
                                                                <>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>CONTAINER</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >
                                                                            {dataDetail && dataDetail?.containerRight ? dataDetail?.containerRight : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>{dataDetail.ocrDatas && dataDetail?.ocrDatas[2]?.container2 ? dataDetail?.ocrDatas[2]?.containe2 : '-'}</TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>ISO CODE</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >
                                                                            {dataDetail && dataDetail?.isoRight ? dataDetail?.isoRight : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {dataDetail.ocrDatas && dataDetail?.ocrDatas[2]?.isoCode2 ? dataDetail?.ocrDatas[2]?.isoCode2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    {/* <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>SEAL</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {dataDetail.ocrDatas && dataDetail?.ocrDatas[2]?.sealPresent ? dataDetail?.ocrDatas[2]?.sealPresent : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {dataDetail.ocrDatas && dataDetail?.ocrDatas[2]?.sealPresent2 ? dataDetail?.ocrDatas[2]?.sealPresent2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow> */}
                                                                    {/* <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>DG CODE</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {dataDetail.ocrDatas && dataDetail?.ocrDatas[2]?.dgCode ? dataDetail?.ocrDatas[2]?.dgCode : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {dataDetail.ocrDatas && dataDetail?.ocrDatas[2]?.dgCode2 ? dataDetail?.ocrDatas[2]?.dgCode2 : '-'}
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow> */}
                                                                    {/* <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>MAXGROSS</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >

                                                                            {
                                                                                dataDetail.ocrDatas && dataDetail?.ocrDatas[2]?.maxGrossWeight > 0
                                                                                    ? dataDetail?.ocrDatas[2]?.maxGrossWeight
                                                                                    : "-"
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {
                                                                                dataDetail.ocrDatas && dataDetail?.ocrDatas[2]?.maxGrossWeight2 > 0
                                                                                    ? dataDetail?.ocrDatas[2]?.maxGrossWeight2
                                                                                    : "-"
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow> */}
                                                                </>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Paper>

                                            {dataDetail && dataDetail.ocrDatas && dataDetail.ocrDatas[2] && dataDetail.ocrDatas[2].flatRackBundle && dataDetail.ocrDatas[2].flatRackBundle.length > 0 ? (
                                                <Paper sx={{ width: '100%', overflow: 'hidden', maxWidth: '400px', }}>
                                                    <TableContainer sx={{ maxHeight: 440 }}>
                                                        <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                            <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                                                <TableRow>
                                                                    {/* <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell> */}
                                                                    <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '16px', padding: '8px' }}>FLAT TRACK</TableCell>
                                                                    {/* <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell> */}
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>

                                                                {dataDetail.ocrDatas[2].flatRackBundle && dataDetail.ocrDatas[2].flatRackBundle.map((bundle, index) => (
                                                                    <React.Fragment key={index} >
                                                                        <TableRow>
                                                                            {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER{index + 1} :</TableCell> */}
                                                                            <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '6px' }} className="container">
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
                                            <Paper sx={{ width: '100%', maxWidth: '400px', overflow: 'hidden' }}>
                                                <TableContainer sx={{ maxHeight: 440 }}>
                                                    <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                        <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                                            <TableRow>
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '16px', padding: '8px' }}>CONTAINER </TableCell>
                                                                {/* <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>CONTAINER 2</TableCell> */}
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {dataDetail && (
                                                                <>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>CONTAINER</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >
                                                                            {dataDetail && dataDetail?.containerRear ? dataDetail?.containerRear : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>{dataDetail.ocrDatas && dataDetail?.ocrDatas[0]?.container2 ? dataDetail?.ocrDatas[0]?.containe2 : '-'}</TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>ISO CODE</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >
                                                                            {dataDetail && dataDetail?.isoRear ? dataDetail?.isoRear : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {dataDetail.ocrDatas && dataDetail?.ocrDatas[0]?.isoCode2 ? dataDetail?.ocrDatas[0]?.isoCode2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>

                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>SEAL</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >
                                                                            {dataDetail && dataDetail?.sealPresentRear ? dataDetail?.associatedOCRData?.sealPresentRear : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {dataDetail.ocrDatas && dataDetail?.ocrDatas[0]?.sealPresent2 ? dataDetail?.ocrDatas[0]?.sealPresent2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>DG CODE</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>
                                                                            {dataDetail && dataDetail?.dgCodeRear ? dataDetail?.dgCodeRear : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                            {dataDetail.ocrDatas && dataDetail?.ocrDatas[0]?.dgCode2 ? dataDetail?.ocrDatas[0]?.dgCode2 : '-'}
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }}>MAXGROSS</TableCell>
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '8px' }} >

                                                                            {/* {
                                                                                dataDetail && dataDetail?.associatedOCRData?.maxGrossWeight > 0
                                                                                    ? dataDetail?.associatedOCRData?.maxGrossWeight
                                                                                    : "-"
                                                                            } */}

                                                                            {dataDetail && dataDetail?.maxGrossWeightRear ? dataDetail?.maxGrossWeightRear : '-'}
                                                                        </TableCell>
                                                                        {/* <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }} >
                                                                            {
                                                                                dataDetail.ocrDatas && dataDetail?.ocrDatas[0]?.maxGrossWeight2 > 0
                                                                                    ? dataDetail?.ocrDatas[0]?.maxGrossWeight2
                                                                                    : "-"
                                                                            }
                                                                        </TableCell> */}
                                                                        <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                    </TableRow>
                                                                </>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Paper>

                                            {dataDetail && dataDetail.ocrDatas && dataDetail.ocrDatas[0] && dataDetail.ocrDatas[0].flatRackBundle && dataDetail.ocrDatas[0].flatRackBundle.length > 0 ? (
                                                <Paper sx={{ width: '100%', overflow: 'hidden', maxWidth: '400px', }}>
                                                    <TableContainer sx={{ maxHeight: 440 }}>
                                                        <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                            <TableHead style={{ backgroundColor: '#B6BBC4' }}>
                                                                <TableRow>
                                                                    {/* <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell> */}
                                                                    <TableCell style={{ textAlign: 'center', color: 'white', backgroundColor: "#2c3e50", fontSize: '16px', padding: '8px' }}>FLAT TRACK</TableCell>
                                                                    {/* <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell> */}
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>

                                                                {dataDetail.ocrDatas[0].flatRackBundle && dataDetail.ocrDatas[0].flatRackBundle.map((bundle, index) => (
                                                                    <React.Fragment key={index} >
                                                                        <TableRow>
                                                                            {/* <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>CONTAINER{index + 1} :</TableCell> */}
                                                                            <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '16px', padding: '6px' }} className="container">
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
                                    <TabPanel value='accuracy'>
                                        <div className='flex gap-3'>
                                            <Paper sx={{ width: '100%', maxWidth: '700px', overflow: 'hidden' }}>
                                                <TableContainer sx={{ maxHeight: 440 }}>
                                                    <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                        <TableHead style={{ backgroundColor: '#B6BBC4' }}>

                                                            <TableRow>
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>

                                                                </TableCell>
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>ACCURACY</TableCell>
                                                                <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '12px', padding: '8px' }}>
                                                                    <Snackbar
                                                                        open={snackbarOpen}
                                                                        autoHideDuration={6000}
                                                                        onClose={() => setSnackbarOpen(false)}
                                                                  
                                                                    >
                                                                        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                                                                            {snackbarMessage}
                                                                        </Alert>
                                                                    </Snackbar>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {rows.map((row) => (
                                                                <TableRow key={row.field}>
                                                                    <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>{row.label}</TableCell>
                                                                    <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                        <button onClick={() => handleIconClick(row.field, 1)} style={{ border: 'none', background: 'none' }}>
                                                                            <CheckCircleIcon style={{ color: selections[row.field] === 1 ? 'green' : 'inherit' }} />
                                                                        </button>
                                                                    </TableCell>
                                                                    <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}>
                                                                        <button onClick={() => handleIconClick(row.field, 0)} style={{ border: 'none', background: 'none' }}>
                                                                            <CancelIcon style={{ color: selections[row.field] === 0 ? 'red' : 'inherit' }} />
                                                                        </button>
                                                                    </TableCell>
                                                                    <TableCell style={{ textAlign: 'left', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '8px' }}></TableCell>
                                                                </TableRow>
                                                            ))}

                                                        </TableBody>


                                                    </Table>
                                                    <div className="m-3">
                                                        <Button className="w-full" variant="contained" color="primary" onClick={handleSaveClick}>
                                                            Save
                                                        </Button>
                                                    </div>
                                                </TableContainer>
                                            </Paper>
                                        </div>
                                    </TabPanel>
                                    {dataDetail.lastFixOCRData && 
                                        <TabPanel value="edited">
                                            <p className="ms-2 mt-2 mb-3" style={{ fontSize: '20px' }}>
                                                Edited by : <PersonAddAltIcon /> username : <span style={{ color: dataDetail?.firstOCRData?.username !== dataDetail?.lastFixOCRData?.username ? 'green' : 'initial' }}>
                                                    {dataDetail?.lastFixOCRData?.username}
                                                </span>
                                            </p>
                                            <TableContainer component={Paper} sx={{ width: '100%', maxWidth: '700px', overflow: 'hidden' }}>
                                                <Table aria-label="differences table">
                                                    <TableHead>
                                                        <TableRow >
                                                            <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '16px', padding: '8px' }}>NAME</TableCell>
                                                            <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '16px', padding: '8px' }}>FIRST DATA</TableCell>
                                                            <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '16px', padding: '8px' }}></TableCell>
                                                            <TableCell style={{ textAlign: 'left', color: 'white', backgroundColor: "#2c3e50", fontSize: '16px', padding: '8px' }}>LAST DATA</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody >
                                                        {renderDifferences()}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </TabPanel>
                                    }
                                </TabContext>
                            </Box>
                        </div>
                    )}
                </Box>
            </Modal >
        </>
    )
}

export default ModalGate