import { Vector } from './vector';

type NumberMatrix = Array<Array<number>>;
type DotReturnType<T> =
  T extends Vector ? Vector :
  T extends Matrix ? Matrix :
  T extends number ? Matrix : unknown;

/**
 * Class for modelling Matrix elementary operations 
 * @remarks
 * The operations implemented include:
 * 1. addition
 * 1. Multiplication
 *  1. multiplication by scalar
 *  1. multiplication by vector
 *  1. multiplication by other matrix
 * 1. Transposition
 * 1. Matrix norm for computing distance
 */
 
export class Matrix extends Array<Array<number>> {
  /**
   * @property {number} numRows - Number of rows in the matrix
   * @property {number} numCols - Number of columns in the matrix
  */
  numRows: number = 0;
  numCols: number = 0;

  /**
   * Constructor of the Matrix
   * @remarks
   * The rows of the matrix are not supposed to change in size
   * in runtime. Only the components. It also validates that the
   * array is in fact square
   * @param {Array<number>} rows - The actual rows of the matrix
  */
  constructor(...rows: number[][]) {
    if (rows.length === 0 || rows.some(row => row.length !== rows[0].length)) {
      throw new Error('Invalid matrix: Rows must have the same length.');
    }
    super(...rows);
    this.numRows = rows.length;
    this.numCols = rows[0]?.length ?? 0;
  }

  /**
   * Addition of two matrices
   * @remarks
   * Adds matrices using nested loop. Ideally, I would like to
   * use a more efficient algorithm but this is for illustrative
   * purposes
   * @param {Matrix} other - The matrix to be added
   * @returns {Matrix} The result of the addition
  */
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

  /**
   * Multiplication of two matrices
   * @remarks
   * Multiplies matrices using nested loop. Ideally, I would like to
   * use a more efficient algorithm but this is for illustrative
   * @param {Matrix} b - Matrix to multiply
   * @returns {Matrix} The result of the multiplication
   */
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

  /**
   * Multiplication of two matrices (with first one transposed)
   * @remarks
   * Multiplies matrices using nested loop. Ideally, I would like to
   * use a more efficient algorithm but this is for illustrative
   * @param {Matrix} b - Matrix to multiply
   * @returns {Matrix} The result of the product
  */
  transposedDot(b: Matrix): Matrix {
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

  /**
   * Multiplication of two matrices
   * @remarks
   * Multiplies matrices using nested loop. Ideally, I would like to
   * use a more efficient algorithm but this is for illustrative
   * @param {Matrix} b - Matrix to multiply
   * @param {boolean} transpose - Whether to transpose the first matrix
   * @return {Matrix} The result of the multiplication
  */
  matrixDot(b: Matrix, transpose: boolean = false): Matrix {
    if (!transpose) {
      return this.normalDot(b);
    }
    return this.transposedDot(b);
  }

  /**
   * Multiplication of Matrix with vector
   * @remarks
   * Multiplies matrices using nested loop. Ideally, I would like to
   * use a more efficient algorithm but this is for illustrative
   * @param {Vector} b - The vector to multiply by right
   * @returns {Vector} The result of multiplication
  */
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

  /**
   * Multiplication of Matrix with scalar
   * @remarks
   * Multiplies matrices using nested loop. Ideally, I would like to
   * use a more efficient algorithm but this is for illustrative
   * @param {number} b - scalar to multiply with
   * @returns {Matrix} The result of multiplication
  */
  numberDot(b: number): Matrix {
    const result: NumberMatrix = [];
    for (let i = 0; i < this.numRows; i++) {
      result[i] = [];
      for (let j = 0; j < this.numCols; j++) {
        result[i][j] = this[i][j] * b;
      }
    }
    return new Matrix(...result);
  }

  /**
   * Generic dot operation (Multiplication)
   * @remarks
   * If the argument is numeric, returns scalar multiplication of matrix
   * If the argument is vector, returns vector multiplication
   * If the argument is matrix, returns matrix multiplication
   * @param {T} b - object to multiply by right
   * @param {boolean} transpose - Whether to transpose the matrix
   * @returns {DotReturnType<T>} The result of the multiplication
  */
  dot<T>(b: T, transpose: boolean = false): DotReturnType<T> {
    if (b instanceof Matrix) {
      return this.matrixDot(b, transpose) as DotReturnType<T>;
    }
    if (b instanceof Vector) {
      return this.vectorDot(b) as DotReturnType<T>;
    }
    if (typeof b === 'number') {
      return this.numberDot(b) as DotReturnType<T>;
    }
    throw new Error(`[MATMUL] Vectors must be of type Matrix or Vector or Number.`);
  }

  /**
   * Transpose matrix
   * @returns {Matrix} The matrix transposed
  */
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

  /**
   * Matrix norm
   * @returns {number} The norm of the matrix
  */
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