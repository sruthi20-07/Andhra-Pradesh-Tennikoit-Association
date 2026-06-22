export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export const formatRank = (rank) => {
  if (!rank) return '-';
  const lastDigit = rank % 10;
  const lastTwoDigits = rank % 100;
  if (lastDigit === 1 && lastTwoDigits !== 11) return `${rank}st`;
  if (lastDigit === 2 && lastTwoDigits !== 12) return `${rank}nd`;
  if (lastDigit === 3 && lastTwoDigits !== 13) return `${rank}rd`;
  return `${rank}th`;
};

export const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'APPROVED':
    case 'PAID':
    case 'ACTIVE':
    case 'COMPLETED':
      return 'success';
    case 'PENDING':
    case 'INITIATED':
      return 'warning';
    case 'REJECTED':
    case 'FAILED':
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
};
