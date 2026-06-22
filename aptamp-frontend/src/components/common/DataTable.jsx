import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export default function DataTable({
  columns = [],
  rows = [],
  loading = false,
  searchPlaceholder = 'Search...',
  searchKey = '',
  onSearchChange,
  showSearch = true,
  showExport = true,
  exportFilename = 'report.csv',
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchVal, setSearchVal] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Local filter if onSearchChange is not provided
  const handleLocalSearch = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const filteredRows = (Array.isArray(rows) ? rows : []).filter((row) => {
    if (!searchVal) return true;
    return Object.values(row).some((cellVal) =>
      String(cellVal).toLowerCase().includes(searchVal.toLowerCase())
    );
  });

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleExportCSV = () => {
    if (!Array.isArray(rows) || rows.length === 0) return;
    
    // Header
    const headers = (Array.isArray(columns) ? columns : []).map((col) => col.headerName).join(',');
    
    // Rows
    const csvRows = (Array.isArray(rows) ? rows : []).map((row) =>
      (Array.isArray(columns) ? columns : [])
        .map((col) => {
          const val = row[col.field];
          return `"${String(val || '').replace(/"/g, '""')}"`;
        })
        .join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...csvRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', exportFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', border: '1px solid #D1D9E0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      {/* Controls Bar */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
        sx={{ p: 2, borderBottom: '1px solid #D1D9E0', bgcolor: '#F5F7FA' }}
      >
        {showSearch && (
          <TextField
            variant="outlined"
            size="small"
            placeholder={searchPlaceholder}
            value={searchVal}
            onChange={handleLocalSearch}
            slotProps={{
              input: {
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
              }
            }}
            sx={{ maxWidth: { xs: '100%', sm: 300 } }}
          />
        )}
        {showExport && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportCSV}
            disabled={!Array.isArray(rows) || rows.length === 0}
            sx={{ fontWeight: 600, fontSize: '0.8rem', alignSelf: { xs: 'flex-start', sm: 'auto' } }}
          >
            Export CSV
          </Button>
        )}
      </Stack>

      <TableContainer sx={{ maxHeight: 500 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <Table stickyHeader aria-label="government data grid">
            <TableHead>
              <TableRow>
                {(Array.isArray(columns) ? columns : []).map((col) => (
                  <TableCell
                    key={col.field}
                    align={col.align || 'left'}
                    sx={{
                      bgcolor: '#003366',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      py: 1.8,
                    }}
                  >
                    {col.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      No records found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row, idx) => (
                  <TableRow
                    hover
                    key={row.id || idx}
                    sx={{
                      bgcolor: idx % 2 === 0 ? '#FFFFFF' : '#F5F7FA', // Zebra striping
                    }}
                  >
                    {(Array.isArray(columns) ? columns : []).map((col) => (
                      <TableCell
                        key={col.field}
                        align={col.align || 'left'}
                        sx={{ fontSize: '0.85rem', color: 'text.primary', py: 1.5 }}
                      >
                        {col.renderCell ? col.renderCell({ row }) : row[col.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {!loading && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 50]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: '1px solid #D1D9E0' }}
        />
      )}
    </Paper>
  );
}
