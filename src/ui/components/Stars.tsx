import React from 'react';
import { Star } from 'lucide-react';

interface StarsProps {
  count: number; // 0..3
  maxStars?: number;
  size?: number;
}

export const Stars: React.FC<StarsProps> = ({ count, maxStars = 3, size = 28 }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
      aria-label={`${count} of ${maxStars} stars`}
    >
      {Array.from({ length: maxStars }).map((_, idx) => {
        const isFilled = idx < count;
        return (
          <div
            key={idx}
            style={{
              position: 'relative',
              filter: isFilled ? 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.65))' : 'none',
              transform: isFilled ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.2s',
            }}
          >
            <Star
              size={size}
              fill={isFilled ? '#FFD700' : 'rgba(255, 255, 255, 0.05)'}
              color={isFilled ? '#FFE600' : 'rgba(255, 255, 255, 0.2)'}
              strokeWidth={1.5}
            />
          </div>
        );
      })}
    </div>
  );
};
