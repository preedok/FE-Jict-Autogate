import React from 'react';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';

const CustomTable = ({
  columns,
  loading,
  rows,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  console.log("Rows:", rows);
  const getTextColor = (field, accuracy) => {
    if (!accuracy) return 'black';
    const mapping = {
      'associatedOCRData.axleCount': 'axleAcc',
      'container': 'containerAcc',
      'isoCode': 'isoCodeAcc',
      'associatedOCRData.sealPresent': 'sealAcc',
      'associatedOCRData.dgCode': 'dgCodeAcc',
    };
    const accuracyField = mapping[field];
    return accuracy[accuracyField] === 0 ? 'red' : 'black';
  };

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
                  className="font-bold"
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: '#F9FAFC',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                console.log("Row:", row);
                const accuracy = row.ocrAutogateAccuracy;
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    style={{
                      backgroundColor: 'transparent',
                    }}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      const textColor = getTextColor(column.id, accuracy);
                      return (
                        <TableCell
                          key={`${row.id}-${column.id}`}
                          align={column.align}
                          style={{ fontWeight: 'bold', color: textColor }}
                        >
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default CustomTable;



