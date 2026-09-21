import React from 'react';
import { X, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Bubble } from './Bubble';

interface HowToPlayProps {
  onClose: () => void;
}

export const HowToPlay: React.FC<HowToPlayProps> = ({ onClose }) => {
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
        zIndex: 100,
        padding: '20px',
      }}
    >
      <div
        className="cyber-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--neon-cyan)',
                letterSpacing: '0.08em',
                margin: 0,
              }}
            >
              MISSION PROTOCOLS
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-tech)' }}>
              ENERGY STABILIZATION GUIDE
            </span>
          </div>

          <button
            className="cyber-btn cyber-btn-icon"
            onClick={onClose}
            aria-label="Close protocols guide"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step 1: Goal */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--metal-border)',
            borderRadius: '8px',
            padding: '12px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <CheckCircle2 size={18} color="var(--neon-cyan)" />
            <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '1rem', color: '#FFFFFF', margin: 0 }}>
              1. PRIMARY OBJECTIVE
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Sort plasma energy spheres until each containment cylinder holds exactly 4 spheres of a single uniform frequency.
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
            <Bubble color={0} size={32} />
            <Bubble color={0} size={32} />
            <Bubble color={0} size={32} />
            <Bubble color={0} size={32} />
          </div>
        </div>

        {/* Step 2: Placement Rule */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--metal-border)',
            borderRadius: '8px',
            padding: '12px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <ShieldAlert size={18} color="var(--neon-yellow)" />
            <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '1rem', color: '#FFFFFF', margin: 0 }}>
              2. CONTAINMENT TRANSFER RULES
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            - Tap a source cylinder to lift its top orb.
            <br />
            - Tap a destination cylinder to transfer.
            <br />
            - Orbs can only be placed into an <strong>EMPTY</strong> cylinder or onto an orb of the <strong>MATCHING COLOR</strong>.
            <br />
            - Max capacity is 4 orbs per cylinder.
          </p>
        </div>

        {/* Step 3: Tactical Controls */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--metal-border)',
            borderRadius: '8px',
            padding: '12px 16px',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '1rem', color: '#FFFFFF', marginBottom: '6px' }}>
            3. TACTICAL REWIND & NEURAL HINT
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            - Use <strong>REWIND</strong> (5 charges per level) to reverse tactical errors.
            <br />
            - Activate <strong>NEURAL HINT</strong> if you require neural AI solver guidance.
          </p>
        </div>

        <button
          className="cyber-btn cyber-btn-primary"
          onClick={onClose}
          style={{ width: '100%', marginTop: '8px' }}
        >
          ACKNOWLEDGED
        </button>
      </div>
    </div>
  );
};
