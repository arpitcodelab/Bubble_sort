import React from 'react';

interface AnnouncerProps {
  message: string;
}

export const Announcer: React.FC<AnnouncerProps> = ({ message }) => {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0',
      }}
    >
      {message}
    </div>
  );
};
