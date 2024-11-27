
import React, {
    useState, useEffect
} from 'react';
import {
    Card,
    CardHeader,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import api from '../../../../../service/api';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Tooltip from "@mui/material/Tooltip";
import Swal from 'sweetalert2';
import { Oval } from "react-loader-spinner";
import { translateStatus } from '../../../../../utils/translation';
import ModalDetailGateDashboard from '../../../../../components/modal-detail-gate/ModalDetailGateDashboard';
import { Link } from 'react-router-dom';
import { isAuth } from '../../../../../utils/token';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import socketIOClient from 'socket.io-client';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import iconAvatar from '../../../../../assets/user.png'

const style1 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    maxWidth: 2430,
    height: 650,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: 24,
    p: 3,
};

const transformText = (text) => {
    const matchResult = text.match(/([A-Z])([A-Z]{2,3})([0-9]+)/);

    if (matchResult && matchResult.length === 4) {
        const [, prefix, type, number] = matchResult;
        return `Gate ${type} ${number}`;
    }

    return text;
};

const renderField = (field) => {
    return field !== '' && field !== null ? field : <span></span>;
};
const displayIcons = (data, no) => {
    const { associatedOCRData } = data || {};
    if (!associatedOCRData) {
        return <span></span>;
    }
    const { container, container2, transactionContainer, transactionContainer2 } = associatedOCRData || {};

    const isAllContainerEmpty =
        (
            (no == 1 && (container === null || container === '') && (transactionContainer === null || transactionContainer === ''))
            ||
            (no == 2 && (container2 === null || container2 === '') && (transactionContainer2 === null || transactionContainer2 === ''))
        );


    return !isAllContainerEmpty ? (
        (no == 1 && container == transactionContainer) || (no == 2 && container2 == transactionContainer2) ? (
            <CheckCircleOutlineIcon color='success' />
        ) : (
            <HighlightOffIcon color='error' />
        )
    ) : <span>&nbsp;</span>;
};

const GateCard = ({ title, gateName, isActive }) => {
    const [loading, setLoading] = useState(true);
    const [gateFetch, setGateFetch] = useState({});
    const [data, setData] = useState(null);
    const [open, setOpen] = useState(false);
    const [refreshEnabled, setRefreshEnabled] = useState(true);
    const handleRefreshChange = () => {
        setRefreshEnabled(!refreshEnabled);
    };
    useEffect(() => {
        const fetchDataInterval = setInterval(() => {
            if (refreshEnabled && isActive) {
                fetchData(gateName);
            }
        }, 5000);

        return () => clearInterval(fetchDataInterval);

    }, [gateName, refreshEnabled, isActive]);
    const handleOpen = () => {
        setOpen(true);
    };

    const [openEditOcr, setOpenEditOcr] = useState(false);
    const handleCloseEditOcr = () => {
        setOpenEditOcr(false)
    }
    const handleOpenEditOcr = async (id) => {
        const token = isAuth()
        try {
            const response = await api.get(`/GateTransaction/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const gateData = response.data;
            setEditedOcr({
                id: gateData.id,
                isoCode: gateData?.associatedOCRData?.isoCode,
                isoCode2: gateData?.associatedOCRData?.isoCode2,
                container: gateData?.associatedOCRData?.container,
                container2: gateData?.associatedOCRData?.container2,
                sealPresent: gateData?.associatedOCRData?.sealPresent,
                sealPresent2: gateData?.associatedOCRData?.sealPresent2,
                dgCode: gateData?.associatedOCRData?.dgCode,
                dgCode2: gateData?.associatedOCRData?.dgCode2,
                gateWeight: gateData?.gateWeight,
                transactionAxleCount: gateData?.associatedOCRData?.transactionAxleCount,
                chassisLength: gateData?.associatedOCRData?.chassisLength,
                maxGrossWeight: gateData?.associatedOCRData?.maxGrossWeight,
                maxGrossWeight2: gateData?.associatedOCRData?.maxGrossWeight2,
                flexiTank: gateData?.associatedOCRData?.flexiTank,
                flexiTank2: gateData?.associatedOCRData?.flexiTank2,
                autoGateTransactionId: gateData?.autoGateTransactionId,
            });

            setOpenEditOcr(true)

            setOpen(false)
            console.log('Response data:', response.data);
        } catch (error) {
            console.error('Error fetching gate details:', error);
        }
    }
    const handleUpdateOcr = async () => {
        const token = isAuth()
        try {
            const response = await api.patch(`/GateTransaction/${editeOcr.id}/fix`, {
                dgCode: editeOcr.dgCode,
                dgCode2: editeOcr.dgCode2,
                isoCode: editeOcr.isoCode,
                isoCode2: editeOcr.isoCode2,
                container: editeOcr.container,
                container2: editeOcr.container2,
                sealPresent: editeOcr.sealPresent,
                sealPresent2: editeOcr.sealPresent2,
                gateWeight: editeOcr.gateWeight,
                transactionAxleCount: editeOcr.transactionAxleCount,
                chassisLength: editeOcr.chassisLength,
                maxGrossWeight: editeOcr.maxGrossWeight,
                maxGrossWeight2: editeOcr.maxGrossWeight2,
                flexiTank: editeOcr.flexiTank,
                flexiTank2: editeOcr.flexiTank2,
                autoGateTransactionId: editeOcr.autoGateTransactionId,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log('response', response)
            if (response.status === 200 || response.statusText === 'OK') {
                Swal.fire({
                    icon: 'success',
                    title: 'Successfully',
                    text: 'The OCR has been edited successfully.',
                });
                handleCloseEditOcr();

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unexpected response status.',
                });
                handleCloseEditOcr();
            }
        } catch (error) {
            console.error('Error editing gate:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error,
            });
            handleCloseEditOcr();
        }
    };
    const [editeOcr, setEditedOcr] = useState({
        id: '',
        isoCode: '',
        isoCode2: '',
        container: '',
        container2: '',
        gateWeight: '',
        transactionAxleCount: '',
        sealPresent: '',
        sealPresent2: '',
        maxGrossWeight: '',
        maxGrossWeight2: '',
        flexiTank: '',
        flexiTank2: '',
        autoGateTransactionId: '',
    });
    useEffect(() => {
        const id = editeOcr.id;
        if (id) {
            const changesKey = `editeOcrChanges_${id}`;
            const storedChanges = JSON.parse(localStorage.getItem(changesKey));
            if (storedChanges) {
                setChanges(storedChanges);
            } else {
                setChanges({
                    id: false,
                    isoCode: false,
                    isoCode2: false,
                    container: false,
                    container2: false,
                    gateWeight: false,
                    transactionAxleCount: false,
                    sealPresent: false,
                    sealPresent2: false,
                    maxGrossWeight: false,
                    maxGrossWeight2: false,
                    flexiTank: false,
                    flexiTank2: false,
                    autoGateTransactionId: false
                });
            }
        }
    }, [editeOcr.id]);
    const [changes, setChanges] = useState({
        id: false,
        isoCode: false,
        isoCode2: false,
        container: false,
        container2: false,
        gateWeight: false,
        transactionAxleCount: false,
        sealPresent: false,
        sealPresent2: false,
        maxGrossWeight: false,
        maxGrossWeight2: false,
        flexiTank: false,
        flexiTank2: false,
        autoGateTransactionId: false,
    });

    const handleChange = (field, value) => {
        const uppercasedValue = value.toUpperCase();
        setEditedOcr(prevState => ({
            ...prevState,
            [field]: uppercasedValue
        }));
        setChanges(prevState => ({
            ...prevState,
            [field]: true
        }));
    };

    const handleClose = () => setOpen(false);
    const fetchData = async (gateName) => {
        const token = isAuth()
        try {
            setLoading(true);
            const response = await api.get(`/GateTransaction/last/${gateName}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 204) {
                setData(null);
                setGateFetch((prevGateFetch) => ({
                    ...prevGateFetch,
                    [gateName]: 'No data found for ' + gateName,
                }));
            } else {
                setData(response.data);
            }
        } catch (error) {
            setGateFetch((prevGateFetch) => ({
                ...prevGateFetch,
                [gateName]: 'No Gate found for ' + gateName,
            }));
        } finally {
            setLoading(false);
        }
    };

    const timeCreated = data?.associatedOCRData?.timeCreated;
    const formattedDate = timeCreated ? new Date(timeCreated).toISOString().slice(0, -5) : '';
    useEffect(() => {
        fetchData(gateName);
    }, [gateName]);
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

    return (
        <>
            <Card style={{
                height: '430px', width: '100%', maxWidth: '385px', backgroundColor: data && data.associatedOCRData !== null
                    ? data.associatedOCRData.container === data.associatedOCRData.transactionContainer &&
                        data.associatedOCRData.container2 === data.associatedOCRData.transactionContainer2
                        ? '#C1F2B0'
                        : data.status && data.status.toLowerCase() === 'ocr_corrected'
                            ? '#C1F2B0'
                            : '#FDE5D4'
                    : null
            }} className="mt-10 w-full md:mb-0 flex-grow md:w-1/2 lg:w-1/3 xl:w-1/4">
                <CardHeader
                    variant="gradient"
                    style={{
                        backgroundColor: isActive ? '#7752FE' : 'red',
                        position: 'relative'
                    }}
                    className="mb-4 grid place-items-center relative"
                >
                    <div style={{ position: 'absolute', top: 0, right: 0, marginTop: '5px' }}>
                        <FormGroup>
                            {isActive === true ? (
                                <Tooltip title={`Auto Refresh ${gateName}`} arrow>
                                    <FormControlLabel
                                        control={<Switch size="small" checked={refreshEnabled} onChange={handleRefreshChange} />}
                                        className='text-white'
                                    />
                                </Tooltip>
                            ) : null}
                        </FormGroup>
                    </div>
                    <div className="flex flex-col my-3 items-center">
                        <Typography className="flex gap-3" variant="h5" color="white">
                            {loading && isActive ? (
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
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                                    />
                                </svg>

                            )}
                            <Tooltip placement='top' title={'Click View Transaction' + " " + (gateName)}>
                                <Link to={`/transaction?gateName=${gateName}&currentDateTime=${formattedDate}`}>
                                    {transformText(title)}
                                </Link>
                            </Tooltip>
                        </Typography>
                    </div>
                </CardHeader>
                <p style={{ textAlign: 'center' }}>
                    {/* <span style={{ color: 'red' }}>{gateFetch[gateName] ? gateFetch[gateName]: ''}</span> */}
                    <span style={{ color: 'green' }}>{data && data.status ? translateStatus(data.status) : '-'}</span>
                </p>
                <p style={{ textAlign: 'center' }} >
                    {/* <span style={{ color: 'red' }}>{gateFetch[gateName] ? gateFetch[gateName]: ''}</span> */}
                    {/* <span style={{ color: 'green' }}>{data && data.autogateStatus ? data.autogateStatus : '-'}</span> */}
                    <span style={{ color: data && data.autogateStatus && data.autogateStatus.includes('error') ? 'red' : 'green' }}>
                        {data && data.autogateStatus ? data.autogateStatus : '-'}
                    </span>
                </p>
                <p style={{ textAlign: 'center', color: '#7752FE', fontWeight: '600' }} className='my-1'> {formatDate(data?.associatedOCRData?.timeCreated)}</p>
                {/* <span className='ms-5 text-green-800'>{formatDate(data?.associatedOCRData?.timeCreated)}</span> */}
                <CardFooter>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 440, overflow: 'hidden' }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ textAlign: 'center', backgroundColor: '#F9FAFC' }}>OCR</TableCell>
                                        <TableCell style={{ textAlign: 'center', backgroundColor: '#F9FAFC' }}>TRANSACTION</TableCell>
                                        <TableCell style={{ textAlign: 'center', backgroundColor: '#F9FAFC' }}></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell style={{ textAlign: 'center' }} className="container">
                                            {renderField(data?.associatedOCRData?.container)}&nbsp;
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            {renderField(data?.associatedOCRData?.transactionContainer)}&nbsp;
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            {displayIcons(data, 1)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ textAlign: 'center' }} className="container2">
                                            {renderField(data?.associatedOCRData?.container2)}&nbsp;
                                        </TableCell>

                                        <TableCell style={{ textAlign: 'center' }}>
                                            {renderField(data?.associatedOCRData?.transactionContainer2)}&nbsp;
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            {displayIcons(data, 2)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Paper>

                    <div className="pt-0 gap-3 flex flex-col items-center mt-4 md:flex-row md:items-center">
                        {data && data.associatedOCRData !== null ? (
                            data.associatedOCRData.container === data.associatedOCRData.transactionContainer &&
                                data.associatedOCRData.container2 === data.associatedOCRData.transactionContainer2 ? (
                                <Button onClick={() => handleOpen()} style={{ backgroundColor: '#7752FE', width: '100%', textAlign: 'center' }}>
                                    Info
                                </Button>
                            ) : (
                                <>
                                    {data.status && data.status.toLowerCase() !== "ocr_corrected" && (
                                        <Button onClick={() => handleOpenEditOcr(data?.id)} variant="gradient" color="green" style={{ backgroundColor: '#7752FE', width: '100%', textAlign: 'center' }}>
                                            Edit
                                        </Button>
                                    )}
                                    <Button onClick={() => handleOpen()} style={{ backgroundColor: '#7752FE', width: '100%', textAlign: 'center' }}>
                                        Info
                                    </Button>
                                </>
                            )
                        ) : null}
                    </div>
                </CardFooter>
              
            </Card>

            <ModalDetailGateDashboard
                open={open}
                handleClose={handleClose}
                data={data}
                gateName={gateName}
                refreshEnabled={refreshEnabled}
                handleRefreshChange={handleRefreshChange}
                loading={loading}
            />
            <Modal
                open={openEditOcr}
                onClose={handleCloseEditOcr}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style1}>
                    <IconButton
                        sx={{ position: 'absolute', top: 5, right: 5 }}
                        onClick={handleCloseEditOcr}
                        aria-label="close"
                    >
                        <HighlightOffIcon color="error" />
                    </IconButton>
                    <Typography sx={{ fontSize: '24px', fontWeight: '800' }}
                    >EDIT OCR</Typography>
                    <div className="p-4 mt-2">
                        <div className="flex gap-5 mt-31" >
                            <fieldset style={{ border: '2px solid black', borderRadius: '10px', position: 'relative' }}>
                                <legend style={{ width: 'auto', marginLeft: '10px', padding: '0 5px' }}>TRUCK</legend>
                                <div className="p-4" >
                                    <div className="mb-3">
                                        <label className="text-lg">AUTO GATE TRANSACTION ID</label>
                                        <input
                                            type="number"
                                            value={editeOcr.autoGateTransactionId}
                                            onChange={(e) => handleChange('autoGateTransactionId', e.target.value)}
                                            className={`${changes.autoGateTransactionId ? 'bg-green-200' : ''} shadow appearance-none mt-4 border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                        />
                                    </div>
                                    {/* weight */}
                                    <div className="mb-3">
                                        <label className="text-lg">WEIGHT</label>
                                        <input
                                            type="number"
                                            value={editeOcr.gateWeight}
                                            onChange={(e) => handleChange('gateWeight', e.target.value)}
                                            className={`${changes.gateWeight ? 'bg-green-200' : ''} shadow appearance-none mt-4 border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-lg">AXLE COUNT</p>
                                        <FormControl style={{ width: '262px', }} fullWidth variant="outlined" margin="normal">

                                            <Select
                                                native

                                                value={editeOcr.transactionAxleCount}
                                                onChange={(e) => handleChange('transactionAxleCount', e.target.value)}
                                                className={`${changes.transactionAxleCount ? 'bg-green-200' : ''}`}
                                            >
                                                <option selected disabled></option>
                                                <option value={4}>4</option>
                                                <option value={5}>5</option>
                                                <option value={6}>6</option>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="mb-3">
                                        <p className="text-lg">CHASSIS LENGTH</p>
                                        <FormControl fullWidth variant="outlined" margin="normal">

                                            <Select
                                                native
                                                value={editeOcr.chassisLength}
                                                onChange={(e) => handleChange('chassisLength', e.target.value)}
                                                className={`${changes.chassisLength ? 'bg-green-200' : ''}`}
                                            >
                                                <option selected disabled></option>
                                                <option value={0}>0</option>
                                                <option value={20}>20</option>
                                                <option value={40}>40</option>
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            </fieldset>

                            <fieldset style={{ border: '2px solid black', borderRadius: '10px', position: 'relative' }}>
                                <legend style={{ width: 'auto', marginLeft: '10px', padding: '0 5px' }}>CONTAINER</legend>
                                <div className="p-4 flex gap-4">
                                    <div>
                                        {/* Container */}
                                        <div className='flex gap-2'>
                                            <div className="mb-3">
                                                <label className="text-lg mb-4">CONTAINER</label>
                                                <input
                                                    style={{ width: '250px' }}
                                                    type="text"
                                                    value={editeOcr.container}
                                                    onChange={(e) => handleChange('container', e.target.value)}
                                                    className={` ${changes.container ? 'bg-green-200' : ''} shadow mt-4 appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <p className="text-lg">FLEXI TANK</p>
                                                <FormControl style={{ width: '241px' }} fullWidth variant="outlined" margin="normal">

                                                    <Select
                                                        native
                                                        value={editeOcr.flexiTank}
                                                        onChange={(e) => handleChange('flexiTank', e.target.value)}
                                                        className={`${changes.flexiTank ? 'bg-green-200' : ''}`}
                                                    >
                                                        <option selected disabled></option>
                                                        <option value="Y">Y</option>
                                                        <option value="N">N</option>
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </div>
                                        {/* DG CODE */}
                                        <div className='flex gap-2 mt-3'>
                                            <div className="mb-3">
                                                <label className="text-lg">DG CODE</label>
                                                <input
                                                    type="text"
                                                    style={{ width: '250px' }}
                                                    value={editeOcr.dgCode}
                                                    onChange={(e) => handleChange('dgCode', e.target.value)}
                                                    className={`${changes.dgCode ? 'bg-green-200' : ''} shadow mt-4 appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="text-lg">ISO CODE</label>
                                                <input
                                                    type="text"
                                                    style={{ width: '240px', display: 'flex', marginLeft: 'auto' }}
                                                    value={editeOcr.isoCode}
                                                    onChange={(e) => handleChange('isoCode', e.target.value)}
                                                    className={`${changes.isoCode ? 'bg-green-200' : ''} shadow mt-4 appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                                />
                                            </div>
                                        </div>
                                        {/* maxGrossWeight */}
                                        <div className='flex gap-2'>
                                            <div className="mb-3">
                                                <label className="text-lg">MAXGROSS</label>
                                                <input
                                                    type="number"
                                                    style={{ width: '250px' }}
                                                    value={editeOcr.maxGrossWeight}
                                                    onChange={(e) => handleChange('maxGrossWeight', e.target.value)}
                                                    className={`${changes.maxGrossWeight ? 'bg-green-200' : ''} shadow  mt-4 appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <p className="text-lg">SEAL PRESENT</p>
                                                <FormControl style={{ width: '241px' }} fullWidth variant="outlined" margin="normal">

                                                    <Select
                                                        native

                                                        value={editeOcr.sealPresent}
                                                        onChange={(e) => handleChange('sealPresent', e.target.value)}
                                                        className={`${changes.sealPresent ? 'bg-green-200' : ''}`}
                                                    >
                                                        <option selected disabled></option>
                                                        <option value="Y">Y</option>
                                                        <option value="N">N</option>
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>

                            <fieldset style={{ border: '2px solid black', borderRadius: '10px', position: 'relative' }}>
                                <legend style={{ width: 'auto', marginLeft: '10px', padding: '0 5px' }}>CONTAINER 2</legend>
                                <div className="p-4 flex gap-4">
                                    <div className="mt-3">
                                        {/* flexiTank */}
                                        <div className='flex gap-2' style={{ marginTop: '-13px' }}>
                                            <div className="mb-3">
                                                <label className="text-lg mb-4">CONTAINER 2</label>
                                                <input
                                                    type="text"
                                                    style={{ width: '250px' }}
                                                    value={editeOcr.container2}
                                                    onChange={(e) => handleChange('container2', e.target.value)}
                                                    className={` ${changes.container2 ? 'bg-green-200' : ''} shadow appearance-none mt-4 border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <p className="text-lg">FLEXI TANK 2</p>
                                                <FormControl style={{ width: '250px' }} fullWidth variant="outlined" margin="normal">
                                                    <Select
                                                        native
                                                        value={editeOcr.flexiTank2}
                                                        onChange={(e) => handleChange('flexiTank2', e.target.value)}
                                                        className={`${changes.flexiTank2 ? 'bg-green-200' : ''}`}
                                                    >
                                                        <option selected disabled></option>
                                                        <option value="Y">Y</option>
                                                        <option value="N">N</option>
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </div>
                                        {/* ISO CODE */}
                                        <div className='flex gap-2'>
                                            <div className="mb-3">
                                                <label className="text-lg">DG CODE 2</label>
                                                <input
                                                    type="text"
                                                    style={{ width: '250px' }}
                                                    value={editeOcr.dgCode2}
                                                    onChange={(e) => handleChange('dgCode2', e.target.value)}
                                                    className={`${changes.dgCode2 ? 'bg-green-200' : ''} shadow mt-4 appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="text-lg">ISO CODE 2</label>
                                                <input
                                                    type="text"
                                                    style={{ width: '250px', display: 'flex', marginLeft: 'auto' }}
                                                    value={editeOcr.isoCode2}
                                                    onChange={(e) => handleChange('isoCode2', e.target.value)}
                                                    className={`${changes.isoCode2 ? 'bg-green-200' : ''} shadow mt-4 appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                                />
                                            </div>
                                        </div>
                                        {/* SEAL PRESENT */}
                                        <div className='flex gap-2 mt-1'>
                                            <div className="mb-3">
                                                <label className="text-lg">MAXGROSS 2</label>
                                                <input
                                                    type="number"
                                                    style={{ width: '250px' }}
                                                    value={editeOcr.maxGrossWeight2}
                                                    onChange={(e) => handleChange('maxGrossWeight2', e.target.value)}
                                                    className={`${changes.maxGrossWeight2 ? 'bg-green-200' : ''} shadow mt-4 appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <p className="text-lg">SEAL PRESENT 2</p>
                                                <FormControl style={{ width: '250px' }} fullWidth variant="outlined" margin="normal">

                                                    <Select
                                                        native
                                                        value={editeOcr.sealPresent2}
                                                        onChange={(e) => handleChange('sealPresent2', e.target.value)}
                                                        className={`${changes.sealPresent2 ? 'bg-green-200' : ''}`}
                                                    >
                                                        <option selected disabled></option>
                                                        <option value="Y">Y</option>
                                                        <option value="N">N</option>
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                        <div className="flex justify-end mt-2">
                            <Button
                                variant="contained"
                                style={{ backgroundColor: '#7752FE' }}
                                color="primary"
                                size="small"
                                onClick={handleUpdateOcr}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    );
};

export default GateCard;
