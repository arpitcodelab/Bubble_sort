import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmLabel = 'CONFIRM',
  cancelLabel = 'ABORT',
  onConfirm,
  onCancel,
}) => {
  return (
    <div
      className="cyber-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 7, 11, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 110,
        padding: '20px',
      }}
    >
      <div
        className="cyber-panel"
        style={{
          width: '100%',
          maxWidth: '380px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          textAlign: 'center',
          border: '1px solid var(--neon-yellow)',
          boxShadow: '0 0 25px rgba(255, 230, 0, 0.25)',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255, 230, 0, 0.15)',
            border: '1px solid var(--neon-yellow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AlertTriangle size={24} color="var(--neon-yellow)" />
        </div>

        <div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              color: '#FFFFFF',
              margin: '0 0 6px 0',
            }}
          >
            {title}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
            {message}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '8px' }}>
          <button
            className="cyber-btn"
            onClick={onCancel}
            style={{ flex: 1 }}
          >
            {cancelLabel}
          </button>
          <button
            className="cyber-btn cyber-btn-primary"
            onClick={onConfirm}
            style={{ flex: 1, borderColor: 'var(--neon-yellow)', color: 'var(--neon-yellow)' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
