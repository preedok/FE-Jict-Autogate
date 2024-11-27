import React, { useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Button,
    Menu,
    MenuItem,
} from '@mui/material';

const CustomTable = ({
    columns,
    rows,
    data,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
}) => {
    const [chassisLengthFilter, setChassisLengthFilter] = useState('');
    const [maxGrossSortOrder, setMaxGrossSortOrder] = useState('');
    const [showContainerFilter, setShowContainerFilter] = useState(false);
    const [autoGateTransactionIdFilter, setAutoGateTransactionIdFilter] = useState('not-null');

    const handleAutoGateTransactionIdFilterToggle = () => {
        setAutoGateTransactionIdFilter(prevFilter => prevFilter === 'null' ? 'not-null' : 'null');
    };


    const [anchorEl, setAnchorEl] = useState(null);
    const handleChassisLengthMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleChassisLengthMenuClose = (length) => {
        setChassisLengthFilter(length);
        setAnchorEl(null);
    };

    const handleMaxGrossSortOrderChange = () => {
        setMaxGrossSortOrder(maxGrossSortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleContainerFilterToggle = () => {
        setShowContainerFilter(!showContainerFilter);
    };

    const filterAndSortRows = () => {
        let filteredRows = rows;
        let filteredRowsAgId = Array.isArray(data) ? data : [];

        if (showContainerFilter) {
            filteredRows = filteredRows.filter(row => row.container.includes('|'));
        }

        if (chassisLengthFilter !== '') {
            filteredRows = filteredRows.filter(row => {
                const chassisLengths = row.chassisLength;
                if (!chassisLengths) {
                    console.log('associatedOCRData is missing for row:', row);
                    return false;
                }
                const chassisLength = chassisLengths;
                console.log(`Filtering row with chassis length: ${chassisLength}, filter: ${chassisLengthFilter}`);
                return chassisLength == chassisLengthFilter; // Use == for type coercion
            });
        }
        
      
        filteredRows.sort((a, b) => {
            const maxGrossA = parseFloat(a.associatedOCRData?.maxGrossWeight) || 0;
            const maxGrossB = parseFloat(b.associatedOCRData?.maxGrossWeight) || 0;

            console.log(`Raw values: ${a.associatedOCRData?.maxGrossWeight || 'undefined'} (A) and ${b.associatedOCRData?.maxGrossWeight || 'undefined'} (B)`);
            console.log(`Parsed values: ${maxGrossA} (A) and ${maxGrossB} (B)`);

            return maxGrossA - maxGrossB;
        });
        if (autoGateTransactionIdFilter === 'null') {
            filteredRowsAgId = filteredRowsAgId.filter(data => data?.autoGateTransactionId === null);
        } else {
            filteredRowsAgId = filteredRowsAgId.filter(data => data?.autoGateTransactionId !== null);
        }
        console.log('Filtered rows:', filteredRows);
        return filteredRows || filteredRowsAgId;
    };

    const filteredRows = filterAndSortRows();

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{
                                        minWidth: column.minWidth,
                                        backgroundColor: '#F9FAFC',
                                        color: 'black',
                                        fontWeight: '600',
                                    }}
                                >
                                    {column.label}
                                    {column.id === 'container' && (
                                        <Button
                                            onClick={handleContainerFilterToggle}
                                            variant={showContainerFilter ? 'contained' : 'outlined'}
                                            color="primary"
                                            size="small"
                                            style={{ marginLeft: '8px' }}
                                        >
                                            Filter |
                                        </Button>
                                    )}
                                    {column.id === 'chassisLength' && (
                                        <>
                                            <Button
                                                aria-controls="simple-menu"
                                                aria-haspopup="true"
                                                onClick={handleChassisLengthMenuClick}
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                style={{ marginLeft: '8px' }}
                                            >
                                                Filter
                                            </Button>
                                            <Menu
                                                id="simple-menu"
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={Boolean(anchorEl)}
                                                onClose={() => handleChassisLengthMenuClose('')}
                                            >
                                                <MenuItem onClick={() => handleChassisLengthMenuClose('')}>No filter</MenuItem>
                                                <MenuItem onClick={() => handleChassisLengthMenuClose('20')}>20</MenuItem>
                                                <MenuItem onClick={() => handleChassisLengthMenuClose('40')}>40</MenuItem>
                                            </Menu>
                                        </>
                                    )}
                                    {column.id === 'ocrMaxgross' && (
                                        <Button
                                            onClick={handleMaxGrossSortOrderChange}
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            style={{ marginLeft: '8px' }}
                                        >
                                            {maxGrossSortOrder === 'asc' ? 'Desc' : 'Asc'}
                                        </Button>
                                    )}
                                    {column.id === 'transactionId' && (
                                        <Button
                                            onClick={handleAutoGateTransactionIdFilterToggle}
                                            variant={autoGateTransactionIdFilter === 'null' ? 'contained' : 'outlined'}
                                            color="primary"
                                            size="small"
                                            style={{ marginLeft: '8px' }}
                                        >
                                            {autoGateTransactionIdFilter === 'null' ? 'Null' : 'All'}
                                        </Button>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                        <TableCell key={column.id} align={column.align}>
                                            {column.format && typeof value === 'number' ? column.format(value) : value}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default CustomTable;
