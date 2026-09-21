import React from 'react';
import { getTubeRowIndices } from '../../core/layout';
import { Tube as TubeType } from '../../core/types';
import { useBoardScale } from '../hooks/useBoardScale';
import { Tube } from './Tube';

interface BoardProps {
  tubes: TubeType[];
  selectedTubeIndex: number | null;
  hintMove: { from: number; to: number } | null;
  shakeTubeIndex: number | null;
  justSealedTube: number | null;
  colorBlindMode: boolean;
  onTapTube: (index: number) => void;
}

export const Board: React.FC<BoardProps> = ({
  tubes,
  selectedTubeIndex,
  hintMove,
  shakeTubeIndex,
  justSealedTube,
  colorBlindMode,
  onTapTube,
}) => {
  const rowIndices = getTubeRowIndices(tubes.length);
  const scale = useBoardScale({
    totalTubes: tubes.length,
    rowCount: rowIndices.length,
  });

  return (
    <div
      className="cyber-board"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: `${16 * scale}px`,
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '8px 12px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      {rowIndices.map((row, rIdx) => (
        <div
          key={rIdx}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: `${14 * scale}px`,
            width: '100%',
          }}
        >
          {row.map((tubeIndex) => {
            const tube = tubes[tubeIndex];
            if (!tube) return null;

            const isSelected = selectedTubeIndex === tubeIndex;
            const isHintSource = hintMove?.from === tubeIndex;
            const isHintDest = hintMove?.to === tubeIndex;
            const isShaking = shakeTubeIndex === tubeIndex;
            const isJustSealed = justSealedTube === tubeIndex;

            return (
              <Tube
                key={tubeIndex}
                tubeIndex={tubeIndex}
                tube={tube}
                isSelected={isSelected}
                isHintSource={isHintSource}
                isHintDest={isHintDest}
                isShaking={isShaking}
                isJustSealed={isJustSealed}
                colorBlindMode={colorBlindMode}
                onTap={() => onTapTube(tubeIndex)}
                scale={scale}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
