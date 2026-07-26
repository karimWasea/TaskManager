import React from 'react';

const StatusBadge = ({ status }) => {
  let bgColor = '#e2e8f0';
  let color = '#475569';
  
  if (status === 'ToDo') {
    bgColor = '#fef3c7';
    color = '#d97706';
  } else if (status === 'InProgress') {
    bgColor = '#dbeafe';
    color = '#2563eb';
  } else if (status === 'Done') {
    bgColor = '#d1fae5';
    color = '#059669';
  }

  return (
    <span className="status-badge" style={{ backgroundColor: bgColor, color }}>
      {status === 'ToDo' ? 'To Do' : status === 'InProgress' ? 'In Progress' : status}
    </span>
  );
};

export default StatusBadge;
