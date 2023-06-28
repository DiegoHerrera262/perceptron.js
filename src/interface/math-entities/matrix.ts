import { Vector } from "./vector";

type NumberMatrix = Array<Array<number>>;

export class Matrix extends Array<Array<number>> {
  numRows: number = 0;
  numCols: number = 0;

  constructor(...rows: number[][]) {
    if (rows.length === 0 || rows.some(row => row.length !== rows[0].length)) {
      throw new Error('Invalid matrix: Rows must have the same length.');
    }
    super(...rows);
    this.numRows = rows.length;
    this.numCols = rows[0]?.length ?? 0;
  }

  add(other: Matrix): Matrix {
    if (this.numRows !== other.numRows || this.numCols !== other.numCols) {
      throw new Error(`[MATADD] Matrices must have the same dimensions (a = [${this.numRows}, ${this.numCols}], b = [${other.numRows}, ${other.numCols}]).`);
    }

    const result: NumberMatrix = [];

    for (let i = 0; i < this.numRows; i++) {
      result[i] = [];
      for (let j = 0; j < this.numCols; j++) {
        result[i][j] = this[i][j] + other[i][j];
      }
    }

    return new Matrix(...result);
  }

  normalDot(b: Matrix): Matrix {
    if (this.numCols !== b.numRows) {
      throw new Error(`[MATMUL] Matrices must have consistent dimensions (a = [${this.numRows}, ${this.numCols}], b = [${b.numRows}, ${b.numCols}]).`);
    }
    const result: NumberMatrix = [];

    for (let i = 0; i < this.numRows; i++) {
      result[i] = [];
      for (let j = 0; j < b.numCols; j++) {
        let sum = 0;
        for (let k = 0; k < this.numCols; k++) {
          sum += this[i][k] * b[k][j];
        }
        result[i][j] = sum;
      }
    }

    return new Matrix(...result);
  }

  transposedDot(b: Matrix): Matrix {

    /*
    Compute the transposed dot product
    for avoiding to parse the matrix
    twice in future calculations
    */

    if (this.numCols !== b.numCols) {
      throw new Error(`[MATMUL] Matrices must have consistent dimensions (a = [${this.numRows}, ${this.numCols}], b = [${b.numRows}, ${b.numCols}]).`);
    }
    const result: NumberMatrix = [];

    for (let i = 0; i < this.numCols; i++) {
      result[i] = [];
      for (let j = 0; j < b.numCols; j++) {
        let sum = 0;
        for (let k = 0; k < this.numRows; k++) {
          sum += this[k][i] * b[k][j];
        }
        result[i][j] = sum;
      }
    }

    return new Matrix(...result);
  }

  matrixDot(b: Matrix, transpose: boolean = false): Matrix {
    if (!transpose) {
      return this.normalDot(b);
    }
    return this.transposedDot(b);
  }

  vectorDot(b: Vector): Vector {
    if (this.numCols !== b.length) {
      throw new Error(`[VECMUL] Vectors must have the same length (a = [${this.numCols}], b = [${b.length}]).`);
    }

    const result: number[] = [];

    for (let i = 0; i < this.length; i++) {
      let sum = 0;
      for (let j = 0; j < this[0].length; j++) {
        sum += this[i][j] * b[j];
      }
      result[i] = sum;
    }

    return new Vector(...result);
  }

  dot(b: Matrix | Vector, transpose: boolean = false): Vector | Matrix {
    if (b instanceof Matrix) {
      return this.matrixDot(b, transpose);
    }
    if (b instanceof Vector) {
      return this.vectorDot(b);
    }
    throw new Error(`[VECMUL] Vectors must be of type Matrix or Vector.`);
  }

  transpose(): Matrix {
    const rows = this.numRows;
    const cols = this.numCols;

    const transposedMatrix: NumberMatrix = [];

    for (let j = 0; j < cols; j++) {
      transposedMatrix[j] = [];
      for (let i = 0; i < rows; i++) {
        transposedMatrix[j][i] = this[i][j];
      }
    }

    return new Matrix(...transposedMatrix);
  }

  norm(): number {
    let sum = 0;
    for (let i = 0; i < this.numRows; i++) {
      for (let j = 0; j < this.numCols; j++) {
        sum += Math.abs(this[i][j]);
      }
    }
    return sum;
  }
}