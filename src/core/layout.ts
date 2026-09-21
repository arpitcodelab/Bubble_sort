export interface BoardLayout {
  rows: number[][]; // indices of tubes per row, e.g. [[0,1,2,3,4]] or [[0,1,2,3],[4,5,6]]
  tubeWidth: number;
  tubeHeight: number;
  bubbleSize: number;
  gap: number;
}

/**
 * Calculates row partitioning for tubes based on total tube count.
 * Easy (5 tubes) -> [0, 1, 2, 3, 4]
 * Medium (7 tubes) -> [0, 1, 2, 3] and [4, 5, 6]
 * Hard (9 tubes) -> [0, 1, 2, 3, 4] and [5, 6, 7, 8]
 */
export function getTubeRowIndices(totalTubes: number): number[][] {
  if (totalTubes <= 5) {
    const row: number[] = [];
    for (let i = 0; i < totalTubes; i++) row.push(i);
    return [row];
  }

  if (totalTubes === 7) {
    return [
      [0, 1, 2, 3],
      [4, 5, 6],
    ];
  }

  if (totalTubes === 9) {
    return [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8],
    ];
  }

  // Generic split
  const topCount = Math.ceil(totalTubes / 2);
  const topRow: number[] = [];
  const bottomRow: number[] = [];
  for (let i = 0; i < totalTubes; i++) {
    if (i < topCount) topRow.push(i);
    else bottomRow.push(i);
  }
  return [topRow, bottomRow];
}
