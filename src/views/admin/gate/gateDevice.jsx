import React, { useState, useEffect } from 'react'
import ContentCard from '../../../components/card-content/ContentCard';
import {
    Typography,
    Button,
} from "@material-tailwind/react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Helmet } from "react-helmet";
import AddBoxIcon from '@mui/icons-material/AddBox';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import swal from 'sweetalert2';
import api from '../../../service/api'
import AOS from "aos";
import "aos/dist/aos.css";
import { useParams, useNavigate } from 'react-router-dom';
import CustomTable from '../../../components/table/CustomTable';
import { isAuth } from '../../../utils/token';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 600,
    height: 300,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: 24,
    p: 3,
};
const style1 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 600,
    height: 330,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: 24,
    p: 3,
};
const GateDevice = () => {
    const [dataGate, setDataGate] = useState([])
    const navigate = useNavigate();
    const [dataGateDevices, setDataGateDevices] = useState([])
    const { id } = useParams();
    const token = isAuth()
    const GetDataGate = async () => {
        setLoading(true)
        const token = isAuth()
        try {
            const response = await api.get(`/Gate/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDataGate(response.data);
            setDataGateDevices(response.data.gateDevices)
            console.log(response.data)
            setLoading(false)
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    };
    useEffect(() => {
        GetDataGate()
    }, [])

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [open1, setOpen1] = useState(false);
    const handleOpen1 = () => setOpen1(true);
    const handleClose1 = () => setOpen1(false);

    const [deviceName, setDeviceName] = useState('')
    const [ip, setIp] = useState('')
    const handleCreateGateDevice = async () => {
        const token = isAuth()
        try {
            const response = await api.post('/GateDevice', {
                deviceName: dataGate.gateName + '-' + deviceName,
                ip,
                gateId: id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(response)
            if (response.status === 200) {
                swal.fire({
                    icon: 'success',
                    title: 'Gate Created Successfully',
                    text: 'The gate has been created successfully.',
                    showConfirmButton: false,
                    timer: 1000
                });
                handleClose1();
                setDeviceName('');
                setIp('');
            } else {
                swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unexpected response status.',
                });
            }
            GetDataGate();
            handleClose1();
        } catch (error) {
            console.log('error>>', error)
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.message || 'Validation error';
                swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: errorMessage,
                });
            } else {
                swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while creating the gate.',
                });
            }
        }
    };
    const deleteGate = async (gateDeviceId) => {
        const token = isAuth()
        const result = await swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                const response = await api.delete(`/GateDevice/${gateDeviceId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (response.status === 204) {
                    swal.fire({
                        icon: 'success',
                        title: 'Gate Deleted Successfully',
                        text: 'The gate has been deleted successfully.',
                        showConfirmButton: false,
                        timer: 1000,
                    });
                    GetDataGate();
                } else {
                    swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Unexpected response status.',
                    });
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    const errorMessage = error.response.data.message || 'Validation error';
                    swal.fire({
                        icon: 'error',
                        title: 'Validation Error',
                        text: errorMessage,
                    });
                } else {
                    swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'An error occurred while deleting the gate.',
                    });
                }
            }
        }
    };

    const [open, setOpen] = useState(false);
    const handleOpen = async (gateDeviceId) => {
        const token = isAuth()
        try {
            const response = await api.get(`/GateDevice/${gateDeviceId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const gateDataDevice = response.data;
            setEditedGateDevice({
                id: gateDataDevice.id,
                gateId: gateDataDevice.gateId,
                deviceName: gateDataDevice.deviceName,
                ip: gateDataDevice.ip,
            });

            setOpen(true);
            console.log('Response data:', response.data);
        } catch (error) {
            console.error('Error fetching gate details:', error);
        }
    };
    const handleClose = () => setOpen(false);
    const [editedGateDevice, setEditedGateDevice] = useState({
        id: '',
        deviceName: '',
        gateId: '',
        ip: '',
    });
    const handleUpdateGate = async () => {
        const token = isAuth()
        try {
            const response = await api.put(`/GateDevice/${editedGateDevice.id}`, {
                gateId: editedGateDevice.gateId,
                deviceName: editedGateDevice.deviceName,
                ip: editedGateDevice.ip,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                swal.fire({
                    icon: 'success',
                    title: 'Gate Edited Successfully',
                    text: 'The gate has been edited successfully.',
                    showConfirmButton: false,
                    timer: 1000
                });
                handleClose();
                GetDataGate();
            } else {
                swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unexpected response status.',
                });
            }
        } catch (error) {
            console.error('Error editing gate:', error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(Number(event.target.value));
        setPage(0);
    };
    const columns = [
        { id: 'no', label: 'No.', minWidth: 2, align: 'center', },
        { id: 'deviceName', label: 'Device Name', minWidth: 100, align: 'center', },
        { id: 'ip', label: 'Ip', minWidth: 100, align: 'center', },
        {
            id: 'action',
            label: 'Action',
            minWidth: 20,
            align: 'center',
        },
    ];
    function createData(no, deviceName, ip, action) {
        return { no, deviceName, ip, action };
    }
    const rows = dataGateDevices.map((data, index) => {
        return createData(
            index + 1,
            data.deviceName,
            data.ip,
            <div className='flex items-center justify-center gap-2'>
                <Button
                    variant="contained"
                    style={{ backgroundColor: '#1AACAC', padding: '8px' }}
                    color="primary"
                    size='small'
                    onClick={() => handleOpen(data.id)}
                >
                    <EditIcon size='small' />
                </Button>
                <Button
                    variant="contained"
                    style={{ backgroundColor: '#BE3144', padding: '8px' }}
                    color="primary"
                    size='small'
                    onClick={() => deleteGate(data.id)}
                >
                    <DeleteIcon size='small' />
                </Button>
            </div>
        )
    })
    AOS.init();
    AOS.refresh();
    return (
        <>
            <Helmet>
                <title>JICT OCR Monitoring | Gate</title>
            </Helmet>
            <section className="bg-[#f3f4f7]  p-8 ml-4 mr-4 rounded-lg">
                <h3
                    data-aos="zoom-in-right"
                    data-aos-duration="1000"
                    className="text-[#3d3d3d] font-bold text-2xl mb-4"
                >
                    MANAGEMENT GATES <u>{dataGate?.gateName}</u>
                </h3>
                <ContentCard>
                    <Button
                        variant="contained"
                        style={{ backgroundColor: 'red ', paddingTop: '7px', paddingBottom: '7px', paddingLeft: '14px', paddingRight: '20px', zIndex: '999', position: 'relative', }}
                        color="primary"
                        onClick={() => navigate('/gate')}
                        size='small'
                    >
                        <ArrowBackIcon size='small' />
                    </Button>
                    <form className="flex items-center max-w-md ml-auto my-5 gap-3" >
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#7752FE ', paddingTop: '7px', paddingBottom: '7px', paddingLeft: '14px', paddingRight: '20px' }}
                            color="primary"
                            onClick={() => handleOpen1(true)}
                            size='small'
                        >
                            <AddBoxIcon size='small' />
                        </Button>
                        <input
                            type="text"
                            id="myInput"
                            name="myInput"
                            placeholder='Pencarian...'
                            className="shadow  appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </form>
                    <CustomTable
                        columns={columns}
                        loading={loading}
                        rows={rows}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </ContentCard>
            </section>


            {/* CREATE USER MODAL */}
            <Modal
                open={open1}
                onClose={handleClose1}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <IconButton
                        sx={{ position: "absolute", top: 5, right: 5 }}
                        onClick={handleClose1}
                        aria-label="close"
                    >
                        <HighlightOffIcon color="error" />
                    </IconButton>
                    <Typography sx={{ fontSize: '22px', fontWeight: '600' }}
                    >CREATE GATE DEVICE {dataGate.gateName}</Typography>
                    <div className='mt-5'>
                        <div className='flex'>
                            <input
                                fullWidth
                                margin="normal"
                                className="mt-4"
                                style={{ width: '50px', border: '0px' }}
                                value={dataGate.gateName}
                                readonly
                        
                            />
                            <input

                                fullWidth
                                margin="normal"
                                className="mt-4"
                                style={{ width: '10px', border: '0px', padding: '0' }}
                                value={'-'}
                                readonly
                        
                            />
                            <TextField
                                label="Gate Device Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                className="mt-4"
                                value={deviceName}
                                onChange={(e) => setDeviceName(e.target.value)}
                            />
                        </div>
                        <TextField
                            label="Ip"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            className="mt-4"
                            value={ip}
                            onChange={(e) => setIp(e.target.value)}
                        />


                        {/* <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel htmlFor="status">Status</InputLabel>
                            <Select
                                native
                                label="Status"
                                inputProps={{
                                    name: "status",
                                    id: "status",
                                }}
                                value={active}
                                onChange={(e) => setActive(e.target.value)}
                            >
                                <option selected></option>
                                <option value={true}>Active</option>
                                <option value={false}>Non Active</option>
                            </Select>
                        </FormControl> */}
                    </div>

                    <div className='flex justify-end mt-4'>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#7752FE' }}
                            color="primary"
                            size='small'
                            className='px-4 py-2'
                            onClick={handleCreateGateDevice}
                        >
                            <AddIcon />  CREATE
                        </Button>
                    </div>
                </Box>
            </Modal>

            {/* EDIT USER MODAL */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style1}>
                    <IconButton
                        sx={{ position: "absolute", top: 5, right: 5 }}
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <HighlightOffIcon color="error" />
                    </IconButton>
                    <Typography sx={{ fontSize: '22px', fontWeight: '600' }}
                    >EDIT GATE DEVICE</Typography>

                    <div className='mt-5'>
                        <div className='flex'>
                            <input

                                fullWidth
                                margin="normal"
                                className="mt-4"
                                style={{ width: '50px', border: '0px' }}
                                value={editedGateDevice.deviceName.split('-')[0]}
                                readonly
                         
                            />
                            <input
                             
                                
                                fullWidth
                                margin="normal"
                                className="mt-4"
                                style={{ width: '10px', border: '0px', padding: '0' }}
                                value={'-'}
                                readonly
                        
                            />
                            <TextField
                                label="Gate Device Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                className="mt-4"
                                value={editedGateDevice.deviceName.split('-')[1]}
                                onChange={(e) => setEditedGateDevice({ ...editedGateDevice, deviceName: editedGateDevice.deviceName.split('-')[0] + '-' + e.target.value })}
                            />
                        </div>
                        <TextField
                            label="Ip"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            className="mt-4"
                            value={editedGateDevice.ip}
                            onChange={(e) => setEditedGateDevice({ ...editedGateDevice, ip: e.target.value })}
                        />
                    </div>
                    <div className='flex justify-end mt-4'>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#1AACAC' }}
                            color="primary"
                            size='small'
                            className='px-4 py-2'
                            onClick={handleUpdateGate}
                        >
                            <SaveAsIcon className='me-1' />  Update
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    )
}

export default GateDevice