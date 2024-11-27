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
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Helmet } from "react-helmet";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import swal from 'sweetalert2';
import api from '../../../service/api'
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from 'react-router-dom';
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
    height: 380,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: 24,
    p: 3,
};
const Gate = () => {

    const [dataGate, setDataGate] = useState([])
    const token = isAuth()
    const GetDataGate = async () => {
        setLoading(true)
        const token = isAuth()
        try {
            const response = await api.get('/Gate', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDataGate(response.data);
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
    const [gateName, setGateName] = useState('')
    const [type, setType] = useState('')
    const handleCreateGate = async () => {
        try {
            const response = await api.post('/Gate', {
                gateName,
                type,
                active: true
            });

            console.log(response)
            if (response.status === 201) {
                swal.fire({
                    icon: 'success',
                    title: 'Gate Created Successfully',
                    text: 'The gate has been created successfully.',
                    showConfirmButton: false,
                    timer: 1000
                });
                handleClose1();
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
    const deleteGate = async (gateId) => {
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
                const response = await api.delete(`/Gate/${gateId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                console.log('response delete', response)
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
    const handleOpen = async (id) => {
        const token = isAuth()
        try {
            const response = await api.get(`/Gate/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const gateData = response.data;
            setEditedGate({
                id: gateData.id,
                gateName: gateData.gateName,
                type: gateData.type,
                active: gateData.active,
            });

            setOpen(true);
            console.log('Response data:', response.data);
        } catch (error) {
            console.error('Error fetching gate details:', error);
        }
    };
    const handleClose = () => setOpen(false);
    const [editedGate, setEditedGate] = useState({
        id: '',
        gateName: '',
        type: '',
        active: ''
    });
    const handleUpdateGate = async () => {
        const token = isAuth()
        try {
            const response = await api.put(`/Gate/${editedGate.id}`, {
                gateName: editedGate.gateName,
                type: editedGate.type,
                active: editedGate.active,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 204) {
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
        { id: 'name', label: 'Gate Name', minWidth: 100, align: 'center', },
        { id: 'type', label: 'Type', minWidth: 100, align: 'center', },
        { id: 'gateDevice', label: 'Gate Devices', minWidth: 100, align: 'center', },
        { id: 'role', label: 'Status', minWidth: 50, align: 'center', },
        {
            id: 'action',
            label: 'Action',
            minWidth: 20,
            align: 'center',
        },
    ];
    function createData(no, name, type, gateDevice, role, action) {
        return { no, name, type, gateDevice, role, action };
    }
    const rows = dataGate.map((data, index) => {
        const statusText = data.active ? 'Active' : 'Non-Active';
        const statusColor = data.active ? 'green' : 'red';
        const totalDevices = data.gateDevices ? data.gateDevices.length : 0;
        return createData(
            index + 1,
            data.gateName,
            data.type,
            <Button
                variant="contained"
                style={{ backgroundColor: '#1AACAC', padding: '8px' }}
                color="primary"
                size='small'
            >
                <Link to={`${data.id}`} className='btn'>Devices List ({totalDevices})</Link>
            </Button>
            ,
            <span style={{ color: statusColor }}>{statusText}</span>,
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
                    GATE
                </h3>
                <ContentCard>
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
                            style={{ textTransform: 'uppercase' }}
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
                    >CREATE GATES</Typography>
                    <div className='mt-5'>
                        <TextField
                            label="Gate Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            className="mt-4"
                            value={gateName}
                            onChange={(e) => setGateName(e.target.value)}
                        />
                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel htmlFor="">Type</InputLabel>
                            <Select
                                native
                                label="Type"
                                inputProps={{
                                    name: "type",
                                    id: "type",
                                }}
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option selected></option>
                                <option value="IN">IN</option>
                                <option value="OUT">OUT</option>
                            </Select>
                        </FormControl>

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
                            onClick={handleCreateGate}
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
                    >EDIT GATE</Typography>

                    <div className='mt-5'>
                        <TextField
                            label="Gate Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            className="mt-4"
                            value={editedGate.gateName}
                            onChange={(e) => setEditedGate({ ...editedGate, gateName: e.target.value })}
                        />

                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel htmlFor="role">Type</InputLabel>
                            <Select
                                native
                                label="Type"
                                inputProps={{
                                    name: "type",
                                    id: "type",
                                }}
                                value={editedGate.type}
                                onChange={(e) => setEditedGate({ ...editedGate, type: e.target.value })}
                            >
                                {/* <option selected></option> */}
                                <option value="IN">IN</option>
                                <option value="OUT">OUT</option>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel htmlFor="active">Active</InputLabel>
                            <Select
                                native
                                label="Active"
                                inputProps={{
                                    name: "active",
                                    id: "active",
                                }}
                                value={editedGate.active ? 'true' : 'false'}
                                onChange={(e) => setEditedGate({ ...editedGate, active: e.target.value === 'true' })}
                            >
                                <option value=""></option>
                                <option value="true">Active</option>
                                <option value="false">Non Active</option>
                            </Select>
                        </FormControl>
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

export default Gate