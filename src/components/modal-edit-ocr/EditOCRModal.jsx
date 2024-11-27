import React, { useState, useEffect } from 'react';
import { Box, Modal, Typography, Button, Snackbar, Alert, IconButton, Tab, TabContext, TabList, TabPanel, FormControl, Select, TextField, Paper, Table, TableContainer, TableBody, TableRow, TableCell, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Checkbox } from '@material-ui/core';
import { HighlightOffIcon, CheckCircleIcon, CancelIcon, AddIcon, EditIcon, DoneIcon, CancelIcon, ReplayIcon, DeleteForeverIcon, VisibilityIcon } from '@material-ui/icons';
import QRCodeSVG from 'qrcode.react';

const EditOCRModal = ({
    open,
    handleClose,
    dataDetail,
    dataImage,
    handleOpenEditOcr,
    setDataDetail,
    editeOcr,
    handleChange,
    changes,
    detailError,
    handleUpdateOcr,
    handleUpdateAutogate,
    handleCloseEditOcr,
    snackbarOpen,
    setSnackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    autoGate,
    handleChangeAutogate,
    handleIconButtonClick,
    qrCodes,
    handleQRScan,
    handleRetry,
    deleteQRCode,
    handleSaveEticket,
    isLoadingSaving,
    openSnackbar,
    handleSnackbarClose,
    dialogOpen,
    handleDialogOpen,
    handleDialogClose,
    dialogOpenDecoded,
    handleDialogOpenDecoded,
    handleDialogCloseDecoded,
    decodedData,
    dataDetailflatRackBundle,
    editIndex,
    tempData,
    handleTempChange,
    handleSave,
    handleCancel,
    addNewRow,
    sendClicked,
    responseAutogate,
    viewResponseAutogate
}) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            style={{ overflow: 'scroll' }}
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'max-content',
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
            }}>
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
                            {/* Edit OCR Content */}
                            <div className="flex flex-col gap-5 mt-4" >
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
        </Modal>
    );
};

export default EditOCRModal;