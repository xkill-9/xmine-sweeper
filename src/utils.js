// Taken from: https://royvanrijn.com/blog/2019/01/longest-path/
function forEachNeighbor(field, row, col, callback) {
  for (let direction = 0; direction < 9; direction++) {
    if (direction === 4) continue; // This is the same element

    let nRow = row + ((direction % 3) - 1);
    let nCol = col + (Math.floor(direction / 3) - 1);

    if (
      nRow >= 0 &&
      nRow < field.length &&
      nCol >= 0 &&
      nCol < field[0].length
    ) {
      callback(field[nRow][nCol], nRow, nCol);
    }
  }
}

function getCellValue(field, row, col) {
  let value = 0;
  forEachNeighbor(field, row, col, cellValue => {
    value += cellValue;
  });
  return value;
}

function isNeighbor(row, col, nRow, nCol) {
  const isRowNeighbor = Math.abs(row - nRow) === 1 || row === nRow;
  const isColNeighbor = Math.abs(col - nCol) === 1 || col === nCol;
  return isRowNeighbor && isColNeighbor;
}

export function generateEmptyField(size) {
  const field = [];
  let c = size;
  while (c) {
    field.push(new Array(size).fill(0));
    c--;
  }

  return field;
}

export function plantMines(emptyField, mines, initialRow, initialCol) {
  let field = [...emptyField];
  let counter = mines;
  while (counter) {
    const randomRow = Math.floor(Math.random() * (field.length - 1));
    const randomCol = Math.floor(Math.random() * (field.length - 1));
    // Prevent a mine from being planted in the vecinity of the cell the user first clicks on
    const isNotNeighbor = !isNeighbor(
      initialRow,
      initialCol,
      randomRow,
      randomCol
    );
    const isNotInitialCell =
      randomCol !== initialCol && randomRow !== initialRow;
    const isEmpty = field[randomRow][randomCol] === 0;

    const shouldPlantMine = isNotNeighbor && isNotInitialCell && isEmpty;
    if (shouldPlantMine) {
      field[randomRow][randomCol] = 1;
      counter--;
    }
  }
  return field;
}

export function uncoverCell(field, row, col, uncovered = {}) {
  if (uncovered[`${row}${col}`] !== undefined) return uncovered;

  const value = getCellValue(field, row, col);

  if (value > 0) return { [`${row}${col}`]: value };

  if (value === 0) {
    uncovered[`${row}${col}`] = value;
    forEachNeighbor(field, row, col, (value, nRow, nCol) => {
      if (value !== 1) {
        uncovered = {
          ...uncovered,
          ...uncoverCell(field, nRow, nCol, uncovered),
        };
      }
    });
    return uncovered;
  }
}
