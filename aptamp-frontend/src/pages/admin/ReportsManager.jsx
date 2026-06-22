import React, { useState } from 'react';
import { Typography, Box, Card, CardContent, Button, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';;
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';

const REPORT_TYPES = [
  { id: 'players', name: 'Registered Athletes Roster' },
  { id: 'registrations', name: 'Tournament Brackets Ledger' },
  { id: 'payments', name: 'Financial Revenue Reports' }
];

const MOCK_DATA = {
  players: [
    { id: 'PL101', name: 'S. K. R. Naidu', district: 'Visakhapatnam', dob: '2004-05-12', status: 'APPROVED' },
    { id: 'PL102', name: 'T. Lakshmi', district: 'Guntur', dob: '2005-08-20', status: 'APPROVED' },
    { id: 'PL103', name: 'M. Hariprasad', district: 'Krishna', dob: '2003-01-15', status: 'APPROVED' },
    { id: 'PL104', name: 'K. Anuradha', district: 'Nellore', dob: '2004-11-30', status: 'PENDING' }
  ],
  registrations: [
    { id: 'REG01', player: 'S. K. R. Naidu', tournament: 'AP State Championship 2026', category: 'Men\'s Singles', fee: 500, status: 'APPROVED' },
    { id: 'REG02', player: 'T. Lakshmi', tournament: 'AP State Championship 2026', category: 'Women\'s Singles', fee: 500, status: 'APPROVED' },
    { id: 'REG03', player: 'M. Hariprasad', tournament: 'District Federation Cup', category: 'Men\'s Singles', fee: 400, status: 'PENDING_PAYMENT' }
  ],
  payments: [
    { id: 'TXN801', order: 'ORD_RZP_901', amount: 500, date: '2026-06-12', status: 'PAID' },
    { id: 'TXN802', order: 'ORD_RZP_902', amount: 500, date: '2026-06-13', status: 'PAID' },
    { id: 'TXN803', order: 'ORD_RZP_903', amount: 400, date: '2026-06-15', status: 'FAILED' }
  ]
};

export default function ReportsManager() {
  const [reportType, setReportType] = useState('players');
  const [districtFilter, setDistrictFilter] = useState('');

  const currentData = MOCK_DATA[reportType] || [];

  const handleExportCSV = () => {
    if (currentData.length === 0) return;
    
    // Generate CSV contents
    const headers = Object.keys(currentData[0]).join(',');
    const rows = currentData.map(row => 
      Object.values(row).map(val => `"${val}"`).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    
    // Trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `APTA_${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box className="printable-report">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }} className="no-print">
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Export Reports & Data
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>
            Print / Save PDF
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleExportCSV}>
            Export Excel (CSV)
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 4 }} className="no-print">
        <CardContent>
          <Grid container spacing={2}>
            <Grid  item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Select Report Ledger Type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                {REPORT_TYPES.map((t) => (
                  <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid  item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Optional District Filter"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        {REPORT_TYPES.find(r => r.id === reportType)?.name}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <TableContainer component={Paper} id="report-table">
        <Table>
          <TableHead>
            <TableRow>
              {currentData.length > 0 && Object.keys(currentData[0]).map((key) => (
                <TableCell key={key} sx={{ fontWeight: 700, textTransform: 'capitalize' }}>
                  {key}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No data found</TableCell>
              </TableRow>
            ) : (
              currentData.map((row, idx) => (
                <TableRow key={idx}>
                  {Object.values(row).map((val, i) => (
                    <TableCell key={i}>{String(val)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Embedded print media helper styling */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .printable-report {
            padding: 0 !important;
            margin: 0 !important;
          }
          #report-table {
            border: 1px solid black !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </Box>
  );
}
