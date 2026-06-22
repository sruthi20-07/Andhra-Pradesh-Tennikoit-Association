import React from 'react';
import { Chip } from '@mui/material';

export default function StatusBadge({ status }) {
  if (!status) return null;
  const upperStatus = status.toUpperCase();

  let color = 'default';
  let label = status;

  switch (upperStatus) {
    case 'APPROVED':
    case 'CONFIRMED':
    case 'ACTIVE':
    case 'PAID':
      color = 'success'; // Green
      label = status === 'PAID' ? 'Paid' : status === 'ACTIVE' ? 'Active' : status === 'CONFIRMED' ? 'Confirmed' : 'Approved';
      break;
    case 'PENDING':
    case 'PENDING_PAYMENT':
      color = 'warning'; // Amber
      label = status === 'PENDING_PAYMENT' ? 'Pending Payment' : 'Pending';
      break;
    case 'REJECTED':
    case 'CLOSED':
    case 'CANCELLED':
    case 'UNPAID':
      color = 'error'; // Red
      label = status === 'UNPAID' ? 'Unpaid' : status === 'CLOSED' ? 'Closed' : status === 'CANCELLED' ? 'Cancelled' : 'Rejected';
      break;
    case 'COMPLETED':
      color = 'success'; // Green
      label = 'Completed';
      break;
    case 'ONGOING':
      color = 'secondary'; // Purple/Pink
      label = 'Ongoing';
      break;
    case 'UPCOMING':
    case 'DRAFT':
    case 'PUBLISHED':
    case 'REGISTERED':
      color = 'info'; // Blue / Cyan
      label = status === 'PUBLISHED' ? 'Published' : status === 'DRAFT' ? 'Draft' : status === 'REGISTERED' ? 'Registered' : 'Upcoming';
      break;
    default:
      color = 'default';
      label = status;
  }

  return (
    <Chip
      label={label}
      color={color}
      size="small"
      sx={{
        borderRadius: '4px',
        fontWeight: 700,
        textTransform: 'uppercase',
        fontSize: '0.72rem',
        letterSpacing: '0.5px',
      }}
    />
  );
}
