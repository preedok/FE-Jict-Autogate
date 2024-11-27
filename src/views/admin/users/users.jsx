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
import SaveAsIcon from '@mui/icons-material/SaveAs';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import swal from 'sweetalert2';
import CustomTable from '../../../components/table/CustomTable';
import api from '../../../service/api'
import { isAuth } from '../../../utils/token';
import AOS from "aos";
import "aos/dist/aos.css";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 600,
    height: 480,
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
const Users = () => {

    const [dataUser, setDataUser] = useState([])
    const [loading, setLoading] = useState(false);
    const token = isAuth()
    const GetDataUser = async () => {
        const token = isAuth()
        setLoading(true)
        try {
            const response = await api.get('/User', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDataUser(response.data);
            setLoading(false)
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    };
    useEffect(() => {
        GetDataUser()
    }, [])

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [open1, setOpen1] = useState(false);
    const handleOpen1 = () => setOpen1(true);
    const handleClose1 = () => setOpen1(false);
    const [error, setError] = useState(null);

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
        } else {
            setError(null);
        }
    };
    const [username, setUsername] = useState('')
    const [fullname, setFullName] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const handleCreateUser = async () => {
        const token = isAuth()
        try {
            const response = await api.post('/User', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }, {
                username,
                fullname,
                password,
                role,
                active: true
            });

            if (response.status === 200 || response.status === 201) {
                swal.fire({
                    icon: 'success',
                    title: 'User Created Successfully',
                    text: 'The user has been created successfully.',
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
            GetDataUser();
            handleClose1();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.message || 'Validation error';
                swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: errorMessage,
                });
                GetDataUser();
                handleClose1();
            } else {
                swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while creating the user.',
                });
                GetDataUser();
                handleClose1();
            }
        }
    };

    const deleteUser = async (userId) => {
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
                const response = await api.delete(`/User/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (response.status === 204) {
                    swal.fire({
                        icon: 'success',
                        title: 'User Deleted Successfully',
                        text: 'The user has been deleted successfully.',
                        showConfirmButton: false,
                        timer: 1000,
                    });
                    GetDataUser();
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
                        text: 'An error occurred while deleting the user.',
                    });
                }
            }
        }
    };


    const [open, setOpen] = useState(false);
    const handleOpen = async (userId) => {
        const token = isAuth()
        try {
            const response = await api.get(`/User/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const userData = response.data;
            setEditedUser({
                id: userData.id,
                username: userData.username,
                fullname: userData.fullname,
                active: userData.active,
                role: userData.role,
            });

            setOpen(true);
            console.log('Response data:', response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };
    const handleClose = () => setOpen(false);
    const [editedUser, setEditedUser] = useState({
        id: '',
        username: '',
        fullname: '',
        role: '',
        active: ''
    });
    const handleUpdateUser = async () => {
        const token = isAuth()
        try {
            const response = await api.put(`/User/${editedUser.id}`, {
                fullname: editedUser.fullname,
                role: editedUser.role,
                active: editedUser.active,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                swal.fire({
                    icon: 'success',
                    title: 'User Edited Successfully',
                    text: 'The user has been edited successfully.',
                    showConfirmButton: false,
                    timer: 1000
                });
                handleClose();
                GetDataUser();
            } else {
                swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unexpected response status.',
                });
            }
        } catch (error) {
            console.error('Error editing user:', error);
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
        { id: 'name', label: 'User Name', minWidth: 100, align: 'center', },
        { id: 'email', label: 'Full Name', minWidth: 100, align: 'center', },
        { id: 'nohp', label: 'Role', minWidth: 100, align: 'center', },
        { id: 'role', label: 'Status', minWidth: 50, align: 'center', },
        {
            id: 'action',
            label: 'Action',
            minWidth: 20,
            align: 'center',
        },
    ];
    function createData(no, name, email, nohp, role, action) {
        return { no, name, email, nohp, role, action };
    }
    const rows = dataUser.map((data, index) => {
        const statusText = data.active ? 'Active' : 'Non-Active';
        const statusColor = data.active ? 'green' : 'red';
        return createData(
            index + 1,
            data.username,
            data.fullname,
            data.role,
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
                    onClick={() => deleteUser(data.id)}
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
                <title>JICT OCR Monitoring | Users</title>
            </Helmet>
            <section className="bg-[#f3f4f7]  p-8 ml-4 mr-4 rounded-lg">
                <h3
                    data-aos="zoom-in-right"
                    data-aos-duration="1000"
                    className="text-[#3d3d3d] font-bold text-2xl mb-4"
                >
                    MANAGEMENT USERS
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
                            <PersonAddIcon size='small' />
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
                    >CREATE USERS</Typography>
                    <div className='mt-5'>
                        <TextField
                            label="User Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            className="mt-4"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <TextField
                            label="Full Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={fullname}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        {error && (
                            <p style={{ color: 'red' }}>{error}</p>
                        )}

                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel htmlFor="role">Role</InputLabel>
                            <Select
                                native
                                label="Role"
                                inputProps={{
                                    name: "role",
                                    id: "role",
                                }}
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option selected></option>
                                <option value="Admin">Admin</option>
                                <option value="User">User</option>
                            </Select>
                        </FormControl>
                    </div>

                    <div className='flex justify-end mt-4'>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#7752FE' }}
                            color="primary"
                            size='small'
                            className='px-4 py-2'
                            onClick={handleCreateUser}
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
                    >EDIT USERS</Typography>

                    <div className='mt-5'>
                        <TextField
                            label="Full Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            className="mt-4"
                            value={editedUser.fullname}
                            onChange={(e) => setEditedUser({ ...editedUser, fullname: e.target.value })}
                        />

                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel htmlFor="role">Role</InputLabel>
                            <Select
                                native
                                label="Role"
                                inputProps={{
                                    name: "role",
                                    id: "role",
                                }}
                                value={editedUser.role}
                                onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                            >
                                <option selected></option>
                                <option value="Admin">Admin</option>
                                <option value="User">User</option>
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
                                value={editedUser.active ? 'true' : 'false'}
                                onChange={(e) => setEditedUser({ ...editedUser, active: e.target.value === 'true' })}
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
                            onClick={handleUpdateUser}
                        >
                            <SaveAsIcon className='me-1' />  Update
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    )
}

export default Users