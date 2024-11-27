import React, { useEffect, useState, useRef } from "react";
import { TextField, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import ContentCard from "../../../components/card-content/ContentCard";
import CardContent from "@mui/material/CardContent";
import { Helmet } from "react-helmet";
import api from "../../../service/api";
import "../style.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ModalDetailGate from "../../../components/modal-detail-gate/ModalDetailTransaction";
import { useLocation } from 'react-router-dom';
import CustomTable from '../../../components/table/CustomTableTransaction';
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DropdownAksi from "../../../components/dropdown/DropdownAksi";
import { isAuth } from "../../../utils/token";
import swal from "sweetalert";
import MenuItem from "@mui/material/MenuItem";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CardTransaction from "../../../components/card-transaction/CardTransaction";
import FireTruckIcon from '@mui/icons-material/FireTruck';
import LockIcon from '@mui/icons-material/Lock';
import Table from "@mui/material/Table";
import { CardHeader } from "@material-tailwind/react";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import TableBody from "@mui/material/TableBody";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MoneyIcon from '@mui/icons-material/Money';
import Paper from '@mui/material/Paper';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import * as XLSX from 'xlsx';
import useScanDetection from 'use-scan-detection'
import { QRCodeSVG } from 'qrcode.react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ReplayIcon from '@mui/icons-material/Replay';
import { Button, Snackbar, Alert } from '@mui/material';
import { CircularProgress } from '@mui/material';
import QRScanner from './components/QRScanner';

import { Visibility as VisibilityIcon } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DecodedDialog from './components/DecodedDialog';
const style1 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    maxWidth: 2430,
    height: 740,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: 24,
    p: 3,
};
const Search = () => {
    const [autoGate, setAutoGate] = useState('editocr');

    const handleChangeAutogate = (event, newValue) => {
        setAutoGate(newValue);
    };
    const [data, setData] = useState([]);
    const [dataImage, setDataImage] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Nilai Input:", inputValue);
    };
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        const startIndex = newPage * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);
        const newRows = filteredData.slice(startIndex, endIndex).map((item, index) => {
            const correctIndex = startIndex + index + 1;
            return {
                ...item,
                no: correctIndex,
            };
        });
        setRows(newRows);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); 
        const newRows = filteredData.slice(0, parseInt(event.target.value, 10)).map((item, index) => {
            const correctIndex = index + 1;
            return {
                ...item,
                no: correctIndex,
            };
        });
        setRows(newRows);
    };
    const columns = [
        {
            id: "action",
            label: "ACTION",
            minWidth: 100,
            align: "center",
        },
        { id: "no", label: "NO", minWidth: 20, align: "center" },
        { id: "transactionId", label: "AG ID", minWidth: 80, align: "center" },
        { id: "timeCreated", label: "TIME", minWidth: 60, align: "center" },
        { id: "ocrGate", label: "GATE", minWidth: 60, align: "center" },
        {
            id: "tagNr",
            label: "OCR STID",
            minWidth: 30,
            align: "center",
        },
        {
            id: "trTagNr",
            label: "TR STID",
            minWidth: 30,
            align: "center",
        },
        {
            id: "container",
            label: "OCR CONTAINER",
            minWidth: 80,
            align: "center",
        },
        {
            id: "trContainer",
            label: "TR CONTAINER",
            minWidth: 80,
            align: "center",
        },
        {
            id: "doorDirection",
            label: "DOOR DIRECTION",
            minWidth: 80,
            align: "center",
        },
        {
            id: "chassisType",
            label: "CHASSIS TYPE",
            minWidth: 80,
            align: "center",
        },
        { id: "isoCode", label: "ISO CODE", minWidth: 100, align: "center" },
        {
            id: "sealPresent",
            label: "SEAL PRESENT",
            minWidth: 50,
            align: "center",
        },
        {
            id: "dgCodee",
            label: "DG CODE",
            minWidth: 50,
            align: "center",
        },
        {
            id: "axleCount",
            label: "OCR AXLE",
            minWidth: 50,
            align: "center",
        },
        {
            id: "traxleCount",
            label: "TR AXLE",
            minWidth: 50,
            align: "center",
        },
        {
            id: "containerLeft",
            label: "CONTAINER LEFT",
            minWidth: 90,
            align: "center",
        },
        {
            id: "containerRight",
            label: "CONTAINER RIGHT",
            minWidth: 90,
            align: "center",
        },
        {
            id: "containerRear",
            label: "CONTAINER REAR",
            minWidth: 90,
            align: "center",
        },
        {
            id: "isoLeft",
            label: "ISO LEFT",
            minWidth: 50,
            align: "center",
        },
        {
            id: "isoRight",
            label: "ISO RIGHT",
            minWidth: 50,
            align: "center",
        },
        {
            id: "isoRear",
            label: "ISO REAR",
            minWidth: 50,
            align: "center",
        },
        {
            id: "maxgross",
            label: "OCR MAXGROSS",
            minWidth: 150,
            align: "center",
        },
        {
            id: "flexiTank",
            label: "OCR FLEXITANK",
            minWidth: 150,
            align: "center",
        },
        {
            id: "chassisLength",
            label: "CHASSIS LENGTH",
            minWidth: 150,
            align: "center",
        },
        {
            id: "platNo",
            label: "PLAT NR",
            minWidth: 100,
            align: "center",
        },
        {
            id: "transactionPlatNo",
            label: "TRANSACTION PLAT NR",
            minWidth: 100,
            align: "center",
        },
        // {
        //   id: "trmaxgross",
        //   label: "TR MAXGROSS",
        //   minWidth: 80,
        //   align: "center",
        // },
    ];
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('query') || '';
    const fetchData = async () => {
        const token = isAuth()
        try {
            setLoading(true);
            const response = await api.get(`/GateTransaction/search/${searchQuery}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('response search', response)
            console.log('response data search', response.data)
            console.log('token', token)
            if (response.status === 404) {
                setData([]);
            } else {
                setData(response.data);
                setDataImage(response.data[0]);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            swal({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to fetch data',
            });
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [searchQuery]);
    const [open, setOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState([]);
    const [loadingDetail, setLoadingDetail] = useState(false)
    const handleOpen = async (id) => {
        const token = isAuth()
        setLoadingDetail(true)
        try {

            const response = await api.get(`/GateTransaction/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            setOpen(true);

            setDataDetail(response.data);
            localStorage.setItem('idAutoGateDetail', response.data?.id)
            console.log('idAutoGateDetail', response.data?.id)

            setLoadingDetail(false)
        } catch (error) {
            console.log(error)

        }
    };
    const [filteredData, setFilteredData] = useState([]);
    const filterData = () => {
        if (Array.isArray(data)) {
            const regEx = new RegExp(inputValue, "i");
            const results = data.filter((item) => {
                const associatedOCRData = item.associatedOCRData || {};
                return (
                    regEx.test(associatedOCRData.ocrGate) ||
                    regEx.test(associatedOCRData.container) ||
                    regEx.test(associatedOCRData.isoCode) ||
                    regEx.test(associatedOCRData.axleCount)
                );
            });
            setFilteredData(results);
        } else {
            console.error("Data is not an array:", data);
            setFilteredData([]);
        }
    };
    useEffect(() => {
        filterData();
    }, [inputValue, data]);
    const handleClose = () => setOpen(false);

    if (filteredData.some(item => item.associatedOCRData?.container2)) {
        const containerColumnIndex = columns.findIndex(column => column.id === 'container');
        columns[containerColumnIndex].label = 'OCR CONTAINER';
    }


    const rows = filteredData.map((item, index) => {
        const associatedOCRData = item.associatedOCRData || {};
        function formatDate(dateString) {
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


        console.log('tr id:', item.autoGateTransactionId);
        console.log('formatted date:', formatDate(associatedOCRData.timeCreated));
        const containerTr1 = associatedOCRData.transactionContainer || '-';
        const containerTr2 = associatedOCRData.transactionContainer2 || '-';
        const containerTr = (containerTr1 !== '-' && containerTr2 !== '-') ?
            `${containerTr1} | ${containerTr2}` : (containerTr1 !== '-' ? containerTr1 : containerTr2);

        const container1 = associatedOCRData.container || '-';
        const container2 = associatedOCRData.container2 || '-';
        const container = (container1 !== '-' && container2 !== '-') ? `${container1} | ${container2}` : (container1 !== '-' ? container1 : container2);

        const doorDirection1 = associatedOCRData.doorDirection || '-';
        const doorDirection2 = associatedOCRData.doorDirection2 || '-';
        const doorDirection = (containerTr1 !== '-' && containerTr2 !== '-') ?
            `${doorDirection1} | ${doorDirection2}` : (doorDirection1 !== '-' ? doorDirection1 : doorDirection2);
        const tagNumber = associatedOCRData.tagNumber;
        const trTagNumber = associatedOCRData.transactionTagNumber;

        const ocriso = associatedOCRData.isoCode || '-';
        const triso = associatedOCRData.isoCode2 || '-';
        const isoCode = (ocriso !== '-' && triso !== '-') ? `${ocriso} | ${triso}` : (ocriso !== '-' ? ocriso : triso);

        const ocraxle = associatedOCRData.axleCount || '-';
        const traxle = associatedOCRData.transactionAxleCount || '-';
        const axleCount = (ocraxle !== '-' && traxle !== '-') ? `${ocraxle} | ${traxle}` : (ocraxle !== '-' ? ocraxle : traxle);

        const maxgross1 = associatedOCRData.maxGrossWeight || '-';
        const maxgross2 = associatedOCRData.maxGrossWeight2 || '-';
        const maxgross = (maxgross1 !== '-' && maxgross2 !== '-') ? `${maxgross1} | ${maxgross2}` : (maxgross1 !== '-' ? maxgross1 : maxgross2);


        const flexiTank1 = associatedOCRData.flexiTank || '-';
        const flexiTank2 = associatedOCRData.flexiTank2 || '-';
        const flexiTank = (flexiTank1 !== '-' && flexiTank2 !== '-') ? `${flexiTank1} | ${flexiTank2}` : (flexiTank1 !== '-' ? flexiTank1 : flexiTank2);
        const correctIndex = index + 1 + page * rowsPerPage;

        return createData(
            item.id,
            correctIndex,
            item.autoGateTransactionId ? item.autoGateTransactionId : '-',
            formatDate(associatedOCRData.timeCreated),
            associatedOCRData.ocrGate ? associatedOCRData.ocrGate : '-',
            tagNumber,
            trTagNumber,
            container,
            containerTr,
            doorDirection,
            associatedOCRData.chassisType ? associatedOCRData.chassisType : '-',
            isoCode,
            associatedOCRData.sealPresent ? associatedOCRData.sealPresent : '-',
            associatedOCRData.dgCode ? associatedOCRData.dgCode : "-",
            associatedOCRData.axleCount || '-',
            associatedOCRData.transactionAxleCount || '-',
            associatedOCRData.containerLeft ? associatedOCRData.containerLeft : '-',
            associatedOCRData.containerRight ? associatedOCRData.containerRight : '-',
            associatedOCRData.containerRear ? associatedOCRData.containerRear : '-',
            associatedOCRData.isoLeft ? associatedOCRData.isoLeft : '-',
            associatedOCRData.isoRight ? associatedOCRData.isoRight : '-',
            associatedOCRData.isoRear ? associatedOCRData.isoRear : '-',
            maxgross,
            flexiTank,
            associatedOCRData.chassisLength ? associatedOCRData.chassisLength : '-',
            associatedOCRData.platNo ? associatedOCRData.platNo : '-',
            associatedOCRData.transactionPlatNo ? associatedOCRData.transactionPlatNo : '-'
        );
    });

    const exportToExcel = () => {
        const fileName = 'transaction.xlsx';

        function formatDate(dateString) {
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

        const exportData = filteredData.map((row, index) => {
            const associatedOCRData = row.associatedOCRData || {};
            const container1 = associatedOCRData.container || '-';
            const container2 = associatedOCRData.container2 || '-';
            let container = (container1 !== '-' && container2 !== '-')
                ? `${container1} | ${container2}`
                : (container1 !== '-' ? container1 : container2);

            const containerTr1 = associatedOCRData.transactionContainer || '-';
            const containerTr2 = associatedOCRData.transactionContainer2 || '-';
            let containerTr = (containerTr1 !== '-' && containerTr2 !== '-')
                ? `${containerTr1} | ${containerTr2}`
                : (containerTr1 !== '-' ? containerTr1 : containerTr2);


            if (container.includes("|") && containerTr.includes("|")) {

                if (container !== containerTr) {

                    const partsTr = containerTr.split("|").map(part => part.trim());
                    containerTr = partsTr.reverse().join(" | ");
                }
            }



            const ocriso = associatedOCRData.isoCode || '-';
            const ocriso2 = associatedOCRData.isoCode2 || '-';
            const isoCode = (ocriso !== '-' && ocriso2 !== '-')
                ? `${ocriso} | ${ocriso2}`
                : (ocriso !== '-' ? ocriso : ocriso2);

            const trIsoCode = associatedOCRData.transactionIsoCode || '-';
            const trIsoCode2 = associatedOCRData.transactionIsoCode2 || '-';
            const trxIsoCode = (trIsoCode !== '-' && trIsoCode2 !== '-')
                ? `${trIsoCode} | ${trIsoCode2}`
                : (trIsoCode !== '-' ? trIsoCode : trIsoCode2);

            const axleCount = associatedOCRData.axleCount || '-';
            const trAxleCount = associatedOCRData.transactionAxleCount || '-';

            const trMaxgross = associatedOCRData.maxGrossWeight || '-';
            const trMaxgross2 = associatedOCRData.maxGrossWeight2 || '-';
            const ocrMaxgross = (trMaxgross !== '-' && trMaxgross2 !== '-')
                ? `${trMaxgross} | ${trMaxgross2}`
                : (trMaxgross !== '-' ? trMaxgross : trMaxgross2);

            const flexiTank1 = associatedOCRData.flexiTank || '-';
            const flexiTank2 = associatedOCRData.flexiTank2 || '-';
            const flexiTank = (flexiTank1 !== '-' && flexiTank2 !== '-')
                ? `${flexiTank1} | ${flexiTank2}`
                : (flexiTank1 !== '-' ? flexiTank1 : flexiTank2);

            const doorDirection1 = associatedOCRData.doorDirection || '-';
            const doorDirection2 = associatedOCRData.doorDirection2 || '-';
            const doorDirection = (doorDirection1 !== '-' && doorDirection2 !== '-')
                ? `${doorDirection1} | ${doorDirection2}`
                : (doorDirection1 !== '-' ? doorDirection1 : doorDirection2);


            return {
                no: index + 1,
                agid: row.autoGateTransactionId || '-',
                time: associatedOCRData.timeCreated ? formatDate(associatedOCRData.timeCreated) : '-',
                gate: associatedOCRData.ocrGate || '-',
                ocrstid: associatedOCRData.tagNumber || '-',
                trstid: associatedOCRData.transactionTagNumber || '-',
                container,
                containerTr,
                doorDirection,
                chassisType: associatedOCRData.chassisType ? associatedOCRData.chassisType : '-',
                isoCode,
                trxIsoCode,
                sealPresent: associatedOCRData.sealPresent || '-',
                dgCode: associatedOCRData.dgCode || '-',
                axleCount,
                trAxleCount,
                containerLeft: associatedOCRData.containerLeft || '-',
                containerRight: associatedOCRData.containerRight || '-',
                containerRear: associatedOCRData.containerRear || '-',
                isoLeft: associatedOCRData.isoLeft || '-',
                isoRight: associatedOCRData.isoRight || '-',
                isoRear: associatedOCRData.isoRear || '-',
                ocrMaxgross,
                flexiTank,
                chassisLength: associatedOCRData.chassisLength || '-',
                platNo: associatedOCRData.platNo || '-',
                transactionPlatNo: associatedOCRData.transactionPlatNo || '-'
            };
        });

        console.log('excel', exportData);

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, fileName);
    };
    const [openEditOcr, setOpenEditOcr] = useState(false);
    const handleCloseEditOcr = () => {
        setOpenEditOcr(false)
    }
    const [viewResponseAutogate, setViewResponseAutogate] = useState(false);
    const [responseAutogate, setResponseAutogate] = useState([]);
    const [processingIndex, setProcessingIndex] = useState(0);
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
        transactionContainer: '',
        transactionContainer2: '',
        autoGateTransactionId: '',
        gateEtickets: []
    });
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
                    // autoGateTransactionId: false
                });
            }
        }
    }, [editeOcr.id]);
    const [editeAutoGate, setEditedAutoGate] = useState({
        id: '',
    });
    const [detailError, setDetailError] = useState([])
    const [dataDetailflatRackBundle, setDataDetailflatRackBundle] = useState([]);
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
                autoGateTransactionId: gateData.autoGateTransactionId,
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
                transactionContainer: gateData?.associatedOCRData?.transactionContainer,
                transactionContainer2: gateData?.associatedOCRData?.transactionContainer2,
                gateEtickets: gateData?.gateEtickets
            });

            setDataDetailflatRackBundle(response.data)
            console.log('container', gateData?.associatedOCRData?.flatRackBundle[0]?.container)
            console.log('isoCode', gateData?.associatedOCRData?.flatRackBundle[0]?.isoCode)
            setEditedAutoGate({
                id: gateData.id
            })
            setDetailError(response.data)
            setResponseAutogate(false)
            setOpenEditOcr(true)
            setViewResponseAutogate(false)
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
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log('response', response)
            if (response.status === 200 || response.statusText === 'OK') {
                swal({
                    icon: 'success',
                    title: 'Successfully',
                    text: 'The OCR has been edited successfully.',
                });
            } else {
                swal({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unexpected response status.',
                });
                handleCloseEditOcr();
            }
        } catch (error) {
            console.error('Error editing gate:', error);
            swal({
                icon: 'error',
                title: 'Error',
                text: error,
            });
            handleCloseEditOcr();
        }
    };
    const [sendClicked, setSendClicked] = useState(false);
    const handleUpdateAutogate = async () => {
        const token = isAuth();
        try {
            const response = await api.post(`/GateTransaction/process/${editeAutoGate.id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('response', response);
            setAutoGate("autogate");
            if (response.status === 200 || response.statusText === 'OK') {
                const entries = Object.entries(response.data);
                setResponseAutogate(entries.map(([key, value]) => ({ key, value, processed: false })));
                processEntries(entries);
                setViewResponseAutogate(true);
                setSendClicked(true);
            } else {
                swal({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unexpected response status.',
                });
                handleCloseEditOcr();
            }
        } catch (error) {
            console.error('Error editing gate:', error);
            swal({
                icon: 'error',
                title: 'Error',
                text: error.toString(),
            });
            handleCloseEditOcr();
        }
    };
    const processEntries = (entries) => {
        entries.forEach(([key, value], index) => {
            setTimeout(() => {
                setResponseAutogate((prevEntries) => prevEntries.map((entry, i) => {
                    if (i === index) return { ...entry, processed: true };
                    return entry;
                }));
                setProcessingIndex(index + 1);
            }, index * 1000);
        });
    };

    function createData(
        id,
        no,
        transactionId,
        timeCreated,
        ocrGate,
        tagNr,
        trTagNr,
        container,
        trContainer,
        doorDirection,
        chassisType,
        isoCode,
        sealPresent,
        dgCodee,
        axleCount,
        traxleCount,
        containerLeft,
        containerRight,
        containerRear,
        isoLeft,
        isoRight,
        isoRear,
        ocrMaxgross,
        flexiTank,
        chassisLength,
        platNo,
        transactionPlatNo,
        ocrAutogateAccuracy
    ) {
        return {
            action: (
                <>
                    <DropdownAksi
                        itemComponent={
                            <>
                                <MenuItem onClick={() =>
                                    handleOpen(
                                        id
                                    )
                                }>
                                    {loadingDetail ? 'Loading...' : 'Detail'}
                                </MenuItem>
                                <MenuItem onClick={() => handleOpenEditOcr(id)}>Edit</MenuItem>
                            </>
                        }
                    />
                </>
            ),
            id,
            no,
            transactionId,
            timeCreated,
            ocrGate,
            tagNr,
            trTagNr,
            container,
            trContainer,
            doorDirection,
            chassisType,
            isoCode,
            sealPresent,
            dgCodee,
            axleCount,
            traxleCount,
            containerLeft,
            containerRight,
            containerRear,
            isoLeft,
            isoRight,
            isoRear,
            ocrMaxgross,
            flexiTank,
            chassisLength,
            platNo,
            transactionPlatNo,
            ocrAutogateAccuracy,
          
        };
    }

    const [editIndex, setEditIndex] = useState(null);
    const [tempData, setTempData] = useState({ container: '', isoCode: '' });


    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const addNewRow = () => {
        const newRow = { container: "", isoCode: "" };
        setDataDetailflatRackBundle(prevState => ({
            ...prevState,
            associatedOCRData: {
                ...prevState.associatedOCRData,
                flatRackBundle: [
                    ...(prevState.associatedOCRData.flatRackBundle || []),
                    newRow
                ]
            }
        }));
        setEditIndex(dataDetailflatRackBundle.associatedOCRData.flatRackBundle.length);
        setTempData(newRow);
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setTempData(dataDetailflatRackBundle.associatedOCRData.flatRackBundle[index]);
    };

    const handleSave = async (index) => {
        const updatedBundle = {
            ...dataDetailflatRackBundle.associatedOCRData.flatRackBundle[index],
            container: tempData.container,
            isoCode: tempData.isoCode,
        };
        const newBundles = [...dataDetailflatRackBundle.associatedOCRData.flatRackBundle];
        newBundles[index] = updatedBundle;
        const payload = {
            ...dataDetailflatRackBundle,
            associatedOCRData: {
                ...dataDetailflatRackBundle.associatedOCRData,
                flatRackBundle: newBundles
            }
        };
        const id = localStorage.getItem('idAutoGateDetail');
        const token = isAuth();
        try {
            const response = await api.patch(`/GateTransaction/${id}/fix`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setDataDetailflatRackBundle(prevState => ({
                    ...prevState,
                    associatedOCRData: {
                        ...prevState.associatedOCRData,
                        flatRackBundle: newBundles
                    }
                }));
                setSnackbarMessage('Update successful');
                setSnackbarSeverity('success');
            } else {
                throw new Error('Failed to update data');
            }
        } catch (error) {
            setSnackbarMessage('Error updating data: ' + error.message);
            setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
        setEditIndex(null);
    };

    const handleCancel = (index) => {
        if (index === dataDetailflatRackBundle.associatedOCRData.flatRackBundle.length - 1 && tempData.container === "" && tempData.isoCode === "") {
            const newData = [...dataDetailflatRackBundle.associatedOCRData.flatRackBundle];
            newData.pop();
            setDataDetailflatRackBundle(prevState => ({
                ...prevState,
                associatedOCRData: {
                    ...prevState.associatedOCRData,
                    flatRackBundle: newData
                }
            }));
        }
        setEditIndex(null);
    };

    const handleTempChange = (field, value) => {
        setTempData(prev => ({ ...prev, [field]: value }));
    };




    // scanner qr
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [qrCodes, setQRCodes] = useState([]);
    const handleSnackbarOpen = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };
    let scanBuffer = '';
    let lastScanTime = 0;

    const handleKeyPress = (event) => {
        const currentTime = Date.now();
        if (currentTime - lastScanTime > 50) {
            scanBuffer = '';
        }
        lastScanTime = currentTime;

        if (event.key === 'Enter') {
            addNewQRCode(scanBuffer, true);
            scanBuffer = '';
        } else {
            scanBuffer += event.key;
        }
    };

    useEffect(() => {
        window.addEventListener('keypress', handleKeyPress);
        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, []);
    const addNewQRCode = async (code, isScanned = false) => {
        code = code.replaceAll('Shift', '')
            .replaceAll('Control', '')
            .replaceAll('ArrowUp', '')
            .replaceAll('ArrowDown', '')
            .replaceAll('ArrowRight', '')
            .replaceAll('ArrowLeft', '');
        // if (!isScanned) {
        //     handleSnackbarOpen("Ignoring non-tap scanned input");
        //     return;
        // }
        // Check if the code already exists in the qrCodes array
        const isDuplicate = qrCodes.some(qrCode => qrCode.url === code);
        if (isDuplicate) {
            handleSnackbarOpen('This QR code is already added.', 'error');
            return;
        }
        // if (code.length < 10) {
        //     handleSnackbarOpen('QR code length must be at least 10 characters.', 'error');
        //     return;
        // }
        const newQRCode = {
            id: Date.now(),
            url: code,
            scans: 0,
            scanError: false,
            decodedData: {},
            rawdata: '',
            errorMessage: '',
            isLoading: true,
        };

        setQRCodes([newQRCode, ...qrCodes]);

        try {
            const token = sessionStorage.getItem('token');
            const response = await api.post(
                `/GateTransaction/eticket/decode?ct=${code}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': '*/*',
                    },
                }
            );

            const data = response.data;
            setQRCodes((prevQRCodes) =>
                prevQRCodes.map((qrCode) =>
                    qrCode.id === newQRCode.id
                        ? {
                            ...qrCode,
                            decodedData: {
                                error: data.error || null,
                                rawdata: data.rawdata || '',
                                eticketId: data.eticketId || '',
                                cntrId: data.cntrId || '',
                                cntrStatus: data.cntrStatus || '',
                                proformaNbr: data.proformaNbr || '',
                                sizeType: data.sizeType || '',
                                trxTypeId: data.trxTypeId || '',
                                vesselName: data.vesselName || '',
                                companyCode: data.companyCode || '',
                                vesselCode: data.vesselCode || '',
                                voyageCode: data.voyageCode || '',
                            },
                            rawdata: data.rawdata || '',
                            isLoading: false,
                        }
                        : qrCode
                )
            );
            // handleDialogOpenDecoded(data); 
        } catch (error) {
            console.error("Error decoding QR code", error);
            setQRCodes((prevQRCodes) =>
                prevQRCodes.map((qrCode) =>
                    qrCode.id === newQRCode.id
                        ? {
                            ...qrCode,
                            scanError: true,
                            errorMessage: error.response?.data?.message || 'Error decoding QR code',
                            isLoading: false,
                        }
                        : qrCode
                )
            );
        }
    };

    const handleQRScan = (data) => {
        addNewQRCode(data, true);
    };
    useScanDetection({
        onComplete: (code) => {
            if (code.length >= 10) {
                addNewQRCode(code);
            }
            // else {
            //     setSnackbarMessage('QR code length must be at least 10 characters.', 'error');
            //     setSnackbarOpen(true);
            //     markScanError(code);
            // }
        },
        onError: (code) => {
            if (code.length < 10) {
                setSnackbarMessage('QR code length must be at least 10 characters.', 'error');
                setSnackbarOpen(true);
                markScanError(code);
            }
        },
        minLength: 3,
    });
    const deleteQRCode = (id) => {
        setQRCodes(qrCodes.filter((qrCode) => qrCode.id !== id));
    };
    const markScanError = (code) => {
        setQRCodes((prevQRCodes) =>
            prevQRCodes.map((qrCode) =>
                qrCode.url === code ? { ...qrCode, scanError: true } : qrCode
            )
        );
    };
    const handleRetry = (id) => {
        setQRCodes((prevQRCodes) =>
            prevQRCodes.map((qrCode) =>
                qrCode.id === id ? { ...qrCode, scanError: false } : qrCode
            )
        );
    };
    const handleIconButtonClick = () => {
        setAutoGate('eticket');
    };
    const [isLoadingSaving, setIsLoadingSaving] = useState(false);
    const handleSaveEticket = async () => {
        setIsLoadingSaving(true)
        const token = sessionStorage.getItem('token');
        const dataToSave = qrCodes
            .filter(qrCode => !qrCode.scanError)
            .map(qrCode => qrCode.rawdata)
            .filter(rawdata => rawdata && rawdata.trim() !== '');
        try {
            const response = await api.post(
                `/GateTransaction/eticket/${editeOcr.id}`,
                dataToSave,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setSnackbarMessage('Data saved successfully!', 'success');
            setSnackbarOpen(true);
            setAutoGate('editocr');
            await handleOpenEditOcr(editeOcr.id);
        } catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMessage(error.response.data, 'error');
            setSnackbarOpen(true);
            console.error("Error saving data", error);
        } finally {
            setIsLoadingSaving(false)
        }
    };


    const [dialogOpen, setDialogOpen] = useState(false);
    const [fullText, setFullText] = useState('');
    const handleDialogOpen = (text) => {
        setFullText(text);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const [dialogOpenDecoded, setDialogOpenDecoded] = useState(false);
    const [decodedData, setDecodedData] = useState({});


    const handleDialogOpenDecoded = (data) => {
        setDecodedData(data);
        setDialogOpenDecoded(true);
    };

    const handleDialogCloseDecoded = () => {
        setDialogOpenDecoded(false);
    };

    return (
        <>
            <Helmet>
                <title>JICT OCR Monitoring | Search</title>
            </Helmet>
            <section className="bg-[#f3f4f7] p-8 ml-4 mr-4 rounded-lg">
                <h3 className="text-[#3d3d3d] font-bold text-2xl" data-aos="zoom-in-right"
                    data-aos-duration="1000">SEARCH</h3>

                <div className="flex item-center gap-5 mt-5">
                    {/* <FormGroup>
            <FormControlLabel
              required
              control={<Switch />}
              label="Validated Only"
            />
          </FormGroup> */}
                </div>

                <ContentCard>
                    <CardContent>
                        <div className="flex my-2">
                            <Button
                                variant="outlined"
                                style={{ color: "grey", borderColor: "grey", height: '35px' }}
                                size="small"
                                onClick={exportToExcel}
                            >
                                <FileUploadIcon />
                                Export
                            </Button>
                            <form
                                className="flex items-center max-w-md ml-auto"
                                onSubmit={handleSubmit}
                            >

                                <input
                                    type="text"
                                    id="myInput"
                                    name="myInput"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    placeholder='Pencarian...'
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </form>
                        </div>

                        <CustomTable
                            columns={columns}
                            loading={loading}
                            rows={rows}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            handleChangePage={handleChangePage}
                            handleChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </CardContent>
                </ContentCard>
            </section>

            <ModalDetailGate
                open={open}
                handleClose={handleClose}
                dataDetail={dataDetail}
                dataImage={dataImage}
                handleOpenEditOcr={handleOpenEditOcr}

            />
            <Modal
                open={openEditOcr}
                onClose={handleCloseEditOcr}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ overflow: 'scroll' }}
            >
                <Box sx={style1}>
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={() => setSnackbarOpen(false)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                    <IconButton
                        sx={{ position: 'absolute', top: 5, right: 5 }}
                        onClick={handleCloseEditOcr}
                        aria-label="close"
                    >
                        <HighlightOffIcon color="error" />
                    </IconButton>
                    <Typography sx={{ fontSize: '24px', fontWeight: '800' }}>
                        EDIT OCR
                    </Typography>
                    <div className="p-4 mt-[-20px]" >
                        <TabContext value={autoGate}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} >
                                <TabList onChange={handleChangeAutogate} aria-label="lab API tabs example">
                                    <Tab label="Edit OCR" value="editocr" />

                                    <Tab label="Auto Gate Process" value="autogate" />
                                    <Tab label="E-Ticket" value="eticket" />
                                </TabList>
                            </Box>
                            <TabPanel value="editocr" >
                                <div className="flex flex-col gap-5 mt-4" >
                                    <div className="flex gap-5">
                                        <fieldset style={{ border: '2px solid black', borderRadius: '10px', position: 'relative' }}>
                                            <legend style={{ width: 'auto', marginLeft: '10px', padding: '0 5px' }}>TRUCK</legend>
                                            <div className="p-4" >
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
                                                    {detailError && detailError.gateName && detailError.gateName.includes("GIN") && (
                                                        <>
                                                            <p className="text-lg">AXLE COUNT</p>
                                                            <FormControl style={{ width: '262px', }} fullWidth variant="outlined" margin="normal">

                                                                <Select
                                                                    native

                                                                    value={editeOcr.transactionAxleCount}
                                                                    onChange={(e) => handleChange('transactionAxleCount', e.target.value)}
                                                                    className={`${changes.transactionAxleCount ? 'bg-green-200' : ''}`}
                                                                >
                                                                    <option value={0} selected="selected">0</option>
                                                                    <option value={4}>4</option>
                                                                    <option value={5}>5</option>
                                                                    <option value={6}>6</option>
                                                                </Select>
                                                            </FormControl>
                                                        </>
                                                    )}

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

                                    <div className="flex gap-5">
                                        <fieldset style={{ border: '2px solid black', borderRadius: '10px', position: 'relative' }}>
                                            <legend style={{ width: 'auto', marginLeft: '10px', padding: '0 5px' }}>FLATRACK</legend>
                                            <div className="m-3">
                                                <Paper >
                                                    <TableContainer sx={{ maxHeight: 540 }}>
                                                        <Table stickyHeader aria-label="sticky table" style={{ border: '2px solid black' }}>
                                                            <TableBody>
                                                                {dataDetailflatRackBundle &&
                                                                    dataDetailflatRackBundle?.associatedOCRData &&
                                                                    Array.isArray(dataDetailflatRackBundle?.associatedOCRData?.flatRackBundle) && dataDetailflatRackBundle?.associatedOCRData?.flatRackBundle.length ? (
                                                                    dataDetailflatRackBundle?.associatedOCRData?.flatRackBundle.map((bundle, index) => (
                                                                        <TableRow key={index}>
                                                                            <TableCell style={{ textAlign: 'center', backgroundColor: "#F9FAFC", fontSize: '12px', padding: '6px' }}>
                                                                                {editIndex === index ? (
                                                                                    <div className="flex">
                                                                                        <div className="flex gap-2">
                                                                                            <TextField
                                                                                                value={tempData.container}
                                                                                                onChange={(e) => handleTempChange('container', e.target.value)}
                                                                                                variant="outlined"
                                                                                                size="small"
                                                                                                placeholder="Container"
                                                                                            />
                                                                                            <TextField
                                                                                                value={tempData.isoCode}
                                                                                                onChange={(e) => handleTempChange('isoCode', e.target.value)}
                                                                                                variant="outlined"
                                                                                                size="small"
                                                                                                placeholder="Iso Code"
                                                                                            />
                                                                                        </div>
                                                                                        <IconButton onClick={() => handleSave(index)}>
                                                                                            <DoneIcon />
                                                                                        </IconButton>
                                                                                        <IconButton onClick={() => handleCancel(index)}>
                                                                                            <CancelIcon />
                                                                                        </IconButton>
                                                                                    </div>
                                                                                ) : (
                                                                                    <>
                                                                                        {bundle.container} | {bundle.isoCode}
                                                                                        <IconButton onClick={() => handleEdit(index)}>
                                                                                            <EditIcon />
                                                                                        </IconButton>
                                                                                    </>
                                                                                )}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))
                                                                ) : (
                                                                    <TableRow>
                                                                        <TableCell colSpan={1} style={{ backgroundColor: "#F9FAFC", textAlign: 'center' }}>
                                                                            No Data Available
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                                <TableRow>
                                                                    <TableCell colSpan={1} style={{ backgroundColor: "#F9FAFC" }} align="center">
                                                                        <IconButton onClick={addNewRow}>
                                                                            <AddIcon />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Paper>
                                            </div>
                                        </fieldset>
                                        <fieldset style={{ border: '2px solid black', borderRadius: '10px', position: 'relative' }}>
                                            <legend style={{ width: 'auto', marginLeft: '10px', padding: '0 5px' }}>
                                                E-Tickets
                                            </legend>
                                            <div className="m-3 ">
                                                {editeOcr.gateEtickets.length > 0 ? (
                                                    <table className="w-full border-collapse">
                                                        <thead>
                                                            <tr className="bg-gray-100">
                                                                <th className="border p-2">ContainerId</th>
                                                                <th className="border p-2">EticketId</th>
                                                                <th className="border p-2">ExportOrImport</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {editeOcr.gateEtickets.map((ticket, index) => (
                                                                <tr key={index}>
                                                                    <td className="border p-2">{ticket.containerId}</td>
                                                                    <td className="border p-2">{ticket.eticketId}</td>
                                                                    <td className="border p-2">{ticket.exportOrImport}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <p>No gate etickets available</p>
                                                )}
                                                <div className="flex justify-center">
                                                    <IconButton onClick={handleIconButtonClick}>
                                                        <AddIcon />
                                                    </IconButton>
                                                </div>

                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                                <div style={{ position: 'absolute', right: 65, bottom: 35 }} className="ms-auto flex gap-4 justify-end">
                                    <Button
                                        variant="contained"
                                        style={{ backgroundColor: 'green', width: '30%' }}
                                        color="primary"
                                        size="small"
                                        className="ms-auto flex justify-end"
                                        onClick={handleUpdateOcr}
                                    >
                                        Save
                                    </Button>
                                    <Button variant="contained"
                                        style={{ backgroundColor: '#7752FE', width: '30%' }}
                                        color="primary"
                                        size="small" onClick={handleUpdateAutogate}>Send</Button>
                                </div>
                            </TabPanel>
                            {detailError && detailError.gateName && detailError.gateName.includes("GIN") && (
                                <TabPanel value="autogate">
                                    <div style={{ position: 'relative', minHeight: '560px' }}>
                                        {!sendClicked && (
                                            <>
                                                <p
                                                    style={{
                                                        borderRadius: '10px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        width: '300px',
                                                        padding: '8px',
                                                    }}
                                                    className="mb-3"
                                                >
                                                    Validate STID
                                                </p>
                                                <p
                                                    style={{
                                                        borderRadius: '10px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        width: '300px',
                                                        padding: '8px',
                                                    }}
                                                    className="mb-3"
                                                >
                                                    eticketCheck
                                                </p>
                                                <p
                                                    style={{
                                                        borderRadius: '10px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        width: '300px',
                                                        padding: '8px',
                                                    }}
                                                    className="mb-3"
                                                >
                                                    validateTBS
                                                </p>
                                                <p
                                                    style={{
                                                        borderRadius: '10px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        width: '300px',
                                                        padding: '8px',
                                                    }}
                                                    className="mb-3"
                                                >
                                                    ocrCheck
                                                </p>
                                                <p
                                                    style={{
                                                        borderRadius: '10px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        width: '300px',
                                                        padding: '8px',
                                                    }}
                                                    className="mb-3"
                                                >
                                                    nGen
                                                </p>
                                            </>
                                        )}
                                        {viewResponseAutogate && (
                                            <div>
                                                {responseAutogate.map(({ key, value, processed }, index) => (
                                                    <p key={key}
                                                        style={{
                                                            backgroundColor: sendClicked && processed ? (value.includes("Success") ? '#4CCD99' : (value.includes("Error") ? '#D24545' : '#D3D3D3')) : 'transparent',
                                                            borderRadius: '10px',
                                                            color: sendClicked && processed ? 'white' : 'initial',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            width: '300px',
                                                            padding: '8px',
                                                        }}
                                                        className="mb-3"
                                                    >

                                                        {sendClicked && processed ? (
                                                            value.includes("Success") ? <CheckCircleIcon style={{ color: 'white', marginRight: '8px' }} /> :
                                                                (value.includes("Error") ? <CancelIcon style={{ color: 'white', marginRight: '8px' }} /> : null)
                                                        ) : null}
                                                        {key} {sendClicked && (value.includes("Success") || value.includes("Error")) ? `: ${value}` : null}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                        <div style={{ position: 'absolute', right: 0, bottom: 10 }} >
                                            {detailError && detailError.gateName && detailError.gateName.includes("GIN") && (
                                                <Button variant="contained"
                                                    style={{ backgroundColor: '#7752FE', width: '30%' }}
                                                    color="primary"
                                                    size="small" onClick={handleUpdateAutogate}>Send</Button>
                                            )}

                                        </div>
                                    </div>
                                </TabPanel>
                            )}
                            <TabPanel value="eticket">
                                <div className=" mx-auto p-6">
                                    <div className="mb-8">
                                        <h2>Autogate TransactionId :  {editeOcr.autoGateTransactionId}</h2>
                                        <QRScanner onScan={handleQRScan} />
                                        <table style={{ maxHeight: '200px', overflowY: 'auto' }} className="w-full mt-5 border-collapse">
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

                                                        <td className="border p-2 ">
                                                            <div className="flex justify-center items-center">
                                                                {(() => {
                                                                    if (qrCode.url.startsWith('http') || qrCode.url.startsWith('https')) {
                                                                        const truncatedUrl = qrCode.url.length > 20
                                                                            ? `${qrCode.url.substring(0, 20)}...`
                                                                            : qrCode.url;

                                                                        return (
                                                                            <a
                                                                                className="justify-center flex hover:underline"
                                                                                style={{
                                                                                    whiteSpace: 'nowrap',
                                                                                    overflow: 'hidden',
                                                                                    textOverflow: 'ellipsis',
                                                                                    cursor: 'pointer',
                                                                                }}
                                                                                href={qrCode.url.length > 20 ? '#' : qrCode.url}
                                                                                onClick={(e) => {
                                                                                    if (qrCode.url.length > 20) {
                                                                                        e.preventDefault();
                                                                                        handleDialogOpen(qrCode.url);
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {truncatedUrl}
                                                                            </a>
                                                                        );
                                                                    } else {
                                                                        const truncatedText = qrCode.url.length > 20
                                                                            ? `${qrCode.url.substring(0, 20)}...`
                                                                            : qrCode.url;
                                                                        return (
                                                                            <p
                                                                                style={{
                                                                                    whiteSpace: 'nowrap',
                                                                                    overflow: 'hidden',
                                                                                    textOverflow: 'ellipsis',
                                                                                }}
                                                                            >
                                                                                {truncatedText}
                                                                            </p>
                                                                        );
                                                                    }
                                                                })()}

                                                                {qrCode.url.length > 20 && (
                                                                    <VisibilityIcon
                                                                        style={{ cursor: 'pointer', marginLeft: '8px' }}
                                                                        onClick={() => handleDialogOpen(qrCode.url)}
                                                                    />
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="flex justify-center items-center">
                                                            {qrCode.isLoading ? (
                                                                <CircularProgress size={24} />
                                                            ) : qrCode.scanError ? (
                                                                <Alert severity="error" style={{ justifyContent: 'center' }}>
                                                                    {qrCode.errorMessage}
                                                                </Alert>
                                                            ) : (
                                                                qrCode.decodedData.eticketId ||
                                                                    qrCode.decodedData.cntrId ||
                                                                    qrCode.decodedData.cntrStatus
                                                                    ? `${qrCode.decodedData.eticketId || ''} | ${qrCode.decodedData.cntrId || ''} | ${qrCode.decodedData.cntrStatus || ''}`
                                                                    : '-'
                                                            )}

                                                            <VisibilityIcon
                                                                style={{ cursor: 'pointer', marginLeft: '8px' }}
                                                                onClick={() => handleDialogOpenDecoded(qrCode.decodedData)}
                                                            />
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
                                                                // disabled={qrCode.isLoading}
                                                                >
                                                                    <DeleteForeverIcon />  Delete
                                                                </Button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}

                                            </tbody>
                                        </table>

                                    </div>
                                    <div style={{ position: 'absolute' }} >
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

                                <Snackbar
                                    open={openSnackbar}
                                    autoHideDuration={6000}
                                    onClose={handleSnackbarClose}
                                >
                                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                                        {snackbarMessage}
                                    </Alert>
                                </Snackbar>

                                <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
                                    <DialogTitle>Full Text {editeOcr.autoGateTransactionId}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                            {fullText}
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button variant="outlined" onClick={handleDialogClose} color="error">
                                            Close
                                        </Button>
                                    </DialogActions>
                                </Dialog>

                                <DecodedDialog
                                    open={dialogOpenDecoded}
                                    onClose={handleDialogCloseDecoded}
                                    decodedData={decodedData}
                                    autoGateTransactionId={editeOcr.autoGateTransactionId}
                                />

                            </TabPanel>
                        </TabContext>
                    </div>
                </Box>
            </Modal >
        </>
    );
};

export default Search;


