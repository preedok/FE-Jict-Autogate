import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import ContentCard from "../../../components/card-content/ContentCard";
import CardContent from "@mui/material/CardContent";
import InfoIcon from "@mui/icons-material/Info";
import { Helmet } from "react-helmet";
import api from "../../../service/api";
import AOS from "aos";
import "aos/dist/aos.css";
import "../style.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ModalDetailOCRData from '../../../components/modal-detail-gate/ModalDetailOCRData'
import CustomTable from '../../../components/table/CustomTable';
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { isAuth } from "../../../utils/token";
import * as XLSX from 'xlsx';
const OcrData = () => {
    const [gate, setGate] = useState([])
    const [dataGate, setDataGate] = useState([]);
    const [gateDevice, setGateDevice] = useState([])
    const [dataGateDevice, setDataGateDevice] = useState([]);
    const [data, setData] = useState([]);
    const token = isAuth()
    const handleChange1 = (event) => {
        setGate(event.target.value);
    };
    const handleChangeDevice = (event) => {
        setGateDevice(event.target.value);
    };
    const getDataGate = async () => {
        const token = isAuth()
        try {
            setLoading(true);
            const response = await api.get(`/Gate`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDataGate(response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }
    }
    const getDataGateDevice = async () => {
        const token = isAuth()
        try {
            setLoading(true);
            const response = await api.get(`/GateDevice`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDataGateDevice(response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getDataGate()
        getDataGateDevice()
    }, [])
    const [inputValue, setInputValue] = useState("");
    const handleInputChange = (e) => {
        setInputValue(e.target.value.toUpperCase());
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Nilai Input:", inputValue);
    };
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(Number(event.target.value));
        setPage(0);
    };
    const columns = [
        { id: "id", label: "ID", minWidth: 20, align: "center" },
        { id: "timeCreated", label: "TIME", minWidth: 60, align: "center" },
        { id: "ocrGate", label: "GATE", minWidth: 60, align: "center" },
        {
            id: "tagNr",
            label: "OCR STID",
            minWidth: 30,
            align: "center",
        },
        { id: "ocrDevice", label: "GATE DEVICE", minWidth: 60, align: "center" },
        { id: "ocrContainer", label: "OCR CONTAINER", minWidth: 60, align: "center" },
        {
            id: "container",
            label: "CONTAINER NO",
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
            id: "axleCount",
            label: "AXLE TRUCK",
            minWidth: 50,
            align: "center",
        },
        {
            id: "dgCode",
            label: "DG CODE",
            minWidth: 50,
            align: "center",
        },
        {
            id: "platNo",
            label: "PLAT NR",
            minWidth: 50,
            align: "center",
        },
        {
            id: "action",
            label: "ACTION",
            minWidth: 100,
            align: "center",
        },
    ];
    const [loading, setLoading] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    useEffect(() => {
        const getCurrentDateTime = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = '00';
            const minutes = '00';
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        };
        setSelectedStartDate(getCurrentDateTime());
    }, []);

    const handleDateChange = (event) => {
        console.log('start date', event.target.value)
        setSelectedStartDate(event.target.value);
    };
    const handleDateChange1 = (event) => {
        console.log('end date', event.target.value)
        setSelectedEndDate(event.target.value);
    };
    const fetchData = async () => {
        const token = isAuth()
        try {
            setLoading(true);
            const response = await api.get(
                `/OCRData?ocrGate=${gate}&ocrDevice=${gateDevice}&startTime=${selectedStartDate}&endTime=${selectedEndDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );
            setData(response.data);
            console.log('oke', response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }
    };
    const handleSearch = () => {
        fetchData();
    };
    const [open, setOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState("");
    const handleOpen = async (id) => {
        const token = isAuth()
        try {

            const response = await api.get(`/OCRData/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log(response.data)
            setOpen(true);
            console.log('open>>', open)
            setDataDetail(response.data);

            console.log('dataDetail>>', dataDetail)
        } catch (error) {
            console.log(error)

        }
    };
    const [filteredData, setFilteredData] = useState([]);
    const filterData = () => {
        if (Array.isArray(data)) {
            const regEx = new RegExp(inputValue, "i");
            const results = data.filter((item) => {
                return (
                    regEx.test(item.ocrDevice) ||
                    regEx.test(item.ocrGate) ||
                    regEx.test(item.container) ||
                    regEx.test(item.isoCode) ||
                    regEx.test(item.sealPresent) ||
                    regEx.test(item.axleCount) ||
                    regEx.test(item.dgCode)
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
    const rows = filteredData.map((item, index) => {
        function formatDate(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
        const tagNumber = item.tagNumber;
        const container1 = item.container || '-';
        const container2 = item.container2 || '-';
        const container = (container1 !== '-' && container2 !== '-')
            ? `${container1} | ${container2}`
            : (container1 !== '-' ? container1 : container2);
        const ocriso = item.isoCode || '-';
        const triso = item.isoCode2 || '-';
        const isoCode = (ocriso !== '-' && triso !== '-') ? `${ocriso} | ${triso}` : (ocriso !== '-' ? ocriso : triso);

        const ocraxle = item.axleCount || '-';
        const traxle = item.transactionAxleCount || '-';
        const axleCount = (ocraxle !== '-' && traxle !== '-') ? `${ocraxle} | ${traxle}` : (ocraxle !== '-' ? ocraxle : traxle);
        return createData(
            item.id,
            formatDate(item.timeCreated),
            item.ocrGate ? item.ocrGate : '-',
            tagNumber,
            item.ocrDevice ? item.ocrDevice : '-',
            container,
            item.container ? item.container : '-',
            isoCode,
            item.sealPresent ? item.sealPresent : '-',
            axleCount,
            item.dgCode ? item.dgCode : "-",
            item.platNo ? item.platNo : "-"
        );
    });


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
    const exportToExcel = () => {
        const fileName = 'ocrdata.xlsx';
        const exportData = filteredData.map((row, index) => {
            const tagNumber = row.tagNumber;
            const container1 = row.container || '-';
            const container2 = row.container2 || '-';
            const container = (container1 !== '-' && container2 !== '-')
                ? `${container1} | ${container2}`
                : (container1 !== '-' ? container1 : container2);

            
            const ocriso = row.isoCode || '-';
            const triso = row.isoCode2 || '-';
            const isocodee = (ocriso !== '-' && triso !== '-')
                ? `${ocriso} | ${triso}`
                : (ocriso !== '-' ? ocriso : triso);

            const ocraxle = row.axleCount || '-';
            const traxle = row.transactionAxleCount || '-';
            const axlecount = (ocraxle !== '-' && traxle !== '-')
                ? `${ocraxle} | ${traxle}`
                : (ocraxle !== '-' ? ocraxle : traxle);
            return {
                id: row.id,
                timeCreated: row.timeCreated ? formatDate(new Date(row.timeCreated)) : '-',
                ocrGate: row.ocrGate || '-',
                ocrStid: tagNumber || '-',
                ocrDevice: row.ocrDevice || '-',
                container: container || '-',
                isoCode: isocodee,
                sealPresent: row.sealPresent || '-',
                axleCount: axlecount,
                dgCode: row.dgCode || '-',
                platNo: row.platNo || '-',
            };
        });

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, fileName);
    };
    function createData(
        id,
        timeCreated,
        ocrGate,
        tagNr,
        ocrDevice,
        ocrContainer,
        container,
        isoCode,
        sealPresent,
        axleCount,
        dgCode,
        platNo
    ) {
        return {
            id,
            timeCreated,
            ocrGate,
            tagNr,
            ocrDevice,
            ocrContainer,
            container,
            isoCode,
            sealPresent,
            axleCount,
            dgCode,
            platNo,
            action: (
                <Button
                    variant="contained"
                    style={{ backgroundColor: "#7752FE", fontWeight: "600" }}
                    color="primary"
                    size="small"
                    onClick={() =>
                        handleOpen(
                            id
                        )
                    }
                >
                    <InfoIcon className="mr-1" />
                    Detail
                </Button>
            ),
        };
    }

    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    AOS.init();
    AOS.refresh();
    return (
        <>
            <Helmet>
                <title>JICT OCR Monitoring | OCR Data</title>
            </Helmet>
            <section className="bg-[#f3f4f7] p-8 ml-4 mr-4 rounded-lg">
                <h3 className="text-[#3d3d3d] font-bold text-2xl" data-aos="zoom-in-right"
                    data-aos-duration="1000">OCR DATA</h3>
                <div className="flex item-center gap-5 mt-5">
                    <h5 className="font-bold me-6">OCR GATE</h5>
                    <FormControl fullWidth sx={{ backgroundColor: 'white', width: '250px' }}>
                        <select
                            id="demo-simple-select-helper"
                            className="px-1 py-2 rounded-sm"
                            value={gate}
                            onChange={handleChange1}
                            size="small"
                        >
                            <option defaultValue value="">
                                ALL
                            </option>
                            {dataGate.map((item, index) => (
                                <option key={index} value={item.gateName}>
                                    {item.gateName}
                                </option>
                            ))}
                        </select>
                    </FormControl>

                </div>

                <div className="flex item-center gap-5 mt-5">
                    <h5 className="font-bold">GATE DEVICE</h5>
                    <FormControl fullWidth sx={{ backgroundColor: 'white', width: '250px' }}>
                        <select
                            id="demo-simple-select-helper"
                            className="px-1 py-2 rounded-sm"
                            value={gateDevice}
                            onChange={handleChangeDevice}
                            size="small"
                        >
                            <option defaultValue value="">
                                ALL
                            </option>
                            {dataGateDevice.map((item, index) => (
                                <option key={index} value={item.deviceName}>
                                    {item.deviceName}
                                </option>
                            ))}
                        </select>
                    </FormControl>

                </div>
                <div className="flex item-center gap-5  mt-5">
                    <h5 className="font-bold me-16">DATE</h5>
                    <TextField
                        type="datetime-local"
                        label={'Start Time'}
                        id="demo-simple-select"
                        value={selectedStartDate}
                        onChange={handleDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        size="small"
                        sx={{ backgroundColor: "white", width: "250px" }}
                    />
                    <TextField
                        type="datetime-local"
                        id="demo-simple-select"
                        label={'End Time'}
                        value={selectedEndDate}
                        onChange={handleDateChange1}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        size="small"
                        sx={{ backgroundColor: "white", width: "250px" }}
                    />

                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleSearch}
                        sx={{ backgroundColor: "#7752FE", height: "W38px" }}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin me-2"></div>
                            </div>
                        ) : (
                            <>
                                <SearchIcon />{" "}
                            </>
                        )}
                        Search
                    </Button>
                </div>

                <div className="flex item-center gap-5 mt-5 mb-2">
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

            <ModalDetailOCRData open={open} handleClose={handleClose} dataDetail={dataDetail} />
        </>
    );
};

export default OcrData;


