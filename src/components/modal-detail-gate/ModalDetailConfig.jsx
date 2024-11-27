import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Button from '@mui/material/Button';

const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 550,
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    borderRadius: "10px",
};

const ModalDetailConfig = ({
    open,
    handleClose,
    name,
    title,
    value,
    typeInput,
    setValue,
    handleEditData,
}) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style1}>
                <IconButton
                    sx={{ position: 'absolute', top: 5, right: 5 }}
                    onClick={handleClose}
                    aria-label="close"
                >
                    <HighlightOffIcon color="error" />
                </IconButton>
                <div className="p-4 mt-10">
                    <div className="flex flex-col">
                        <div className="mb-3">
                            <label className="text-lg font-semibold">Name</label>
                            <input
                                disabled
                                type="text"
                                value={name}
                                readOnly
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="text-lg font-semibold">Title</label>
                            <input
                                disabled
                                type="text"
                                value={title}
                                readOnly
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        {typeInput.toLowerCase() === 'int' ? (
                            <div className="mb-3">
                                <label className="text-lg font-semibold">Value</label>
                                <input
                                    type="number"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        ) : typeInput.toLowerCase() === 'string' ? (
                            <div className="mb-3">
                                <label className="text-lg font-semibold">Value</label>
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        ) : typeInput.toLowerCase() === 'date' ? (
                            <div className="mb-3">
                                <label className="text-lg font-semibold">Date</label>
                                <input
                                    type="date"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        ) : (
                            <div className="mb-3">
                                <label className="text-lg font-semibold">Value</label>
                                <select
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end mt-2">
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#1AACAC', padding: '8px' }}
                            color="primary"
                            size="small"
                            onClick={handleEditData}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default ModalDetailConfig;
