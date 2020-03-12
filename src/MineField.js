export default class MineField {
  constructor() {
    this.field = [];
  }

  generate(bombs = 10, rows = 8, cols = 8) {
    for (let i = 0; i < rows; i++) {
      this.field[i] = [];
      for (let j = 0; j < cols; j++) {
        this.field[i][j] = 0;
      }
    }

    let c = bombs;
    while (c) {
      const ranX = Math.floor(Math.random() * (this.field.length - 1));
      const ranY = Math.floor(Math.random() * (this.field.length - 1));
      if (this.field[ranX][ranY] === 0) {
        this.field[ranX][ranY] = -1;
        this.forEachNeighbor(
          ranX,
          ranY,
          (number, x, y) => (this.field[x][y] = number + 1)
        );
        c--;
      }
    }
    return this.field;
  }

  /**
   * Iterate over all the neighbor elements of a given element in a mine field:
   * @param {Number} x - X position of the pivot element
   * @param {Number} y - Y position of the pivot element
   * @param {Function} cb - Callback function that'll receive the neighbor element's value, x and y positions as arguments.
   */
  forEachNeighbor(x, y, cb) {
    let xStart = x - 1;
    let yStart = y - 1;

    for (let neighborX = xStart; neighborX <= x + 1; neighborX++) {
      for (let neighborY = yStart; neighborY <= y + 1; neighborY++) {
        if (
          this.field[neighborX] !== undefined &&
          this.field[neighborX][neighborY] !== undefined &&
          this.field[neighborX][neighborY] !== -1 &&
          !(neighborX === x && neighborY === y)
        ) {
          cb(this.field[neighborX][neighborY], neighborX, neighborY);
        }
      }
    }
  }
}
