import { ActivationFunction } from '../interface';
import { Vector } from './vector';

type NumberMatrix = Array<Array<number>>;
type DotReturnType<T> =
  T extends Vector ? Vector :
  T extends Matrix ? Matrix :
  T extends number ? Matrix : unknown;
type VectorizedFunction = (v: Vector) => Vector;
type VectorizedAccFunction = (acc: Vector, v: Vector) => Vector;
type AxisType = 'column' | 'row';

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
  numRows = 0;
  numCols = 0;

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
    if (this.numRows !== b.numRows) {
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
   * @param transpose - Whether to transpose the first matrix
   * @return {Matrix} The result of the multiplication
  */
  matrixDot(b: Matrix, transpose = false): Matrix {
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
   * @param transpose - Whether to transpose the matrix
   * @returns {DotReturnType<T>} The result of the multiplication
  */
  dot<T>(b: T, transpose = false): DotReturnType<T> {
    if (b instanceof Matrix) {
      return this.matrixDot(b, transpose) as DotReturnType<T>;
    }
    if (b instanceof Vector) {
      return this.vectorDot(b) as DotReturnType<T>;
    }
    if (typeof b === 'number') {
      return this.numberDot(b) as DotReturnType<T>;
    }
    throw new Error('[MATMUL] Vectors must be of type Matrix or Vector or Number.');
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
   * @remarks
   * This norm is a 1-norm, based on absolute value
   * of the elements.
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

  /**
   * Vectorized operation
   * @remarks
   * This function applies a simple scalar function
   * ```javascript
   * const f = (a: number) => number
   * ```
   * to all the elements of the matrix
   * @param {function (number): number} f - Callback function
   * @returns {Matrix} Returns the operation applied to all elements of
   * a matrix
  */
  apply(f: ActivationFunction): Matrix {
    const result: NumberMatrix = [];
    for (let i = 0; i < this.numRows; i++) {
      result[i] = [];
      for (let j = 0; j < this.numCols; j++) {
        result[i][j] = f(this[i][j]);
      }
    }
    return new Matrix(...result);
  }

  /**
   * Fetch a matrix row by index
   * @param {number} idx - index of row to fetch
   * @returns {Vector} row vector
   */
  getRow(idx: number): Vector {
    if (idx < 0 || idx >= this.numRows) {
      throw new Error(`[ROW] Row index out of bounds (rows = ${this.numRows}).`);
    }
    return new Vector(...this[idx]);
  }

  /**
   * Update row by index
   * @param {number} idx - index of row to update
   * @param {number[]} col - vector for updating row
   */
  setRow(idx: number, row: number[]) {
    if (row.length !== this.numCols) {
      throw new Error(`[ROW] Column must have the same length (cols = ${this.numRows}).`);
    }
    for (let jdx = 0; jdx < this.numCols; jdx++) {
      this[idx][jdx] = row[jdx];
    }
  }

  /**
   * Fetch a matrix column by index
   * @param {number} idx - index of column to fetch
   * @returns {Vector} column vector
   */
  getColumn(idx: number): Vector {
    if (idx < 0 || idx >= this.numRows) {
      throw new Error(`[COL] Row index out of bounds (rows = ${this.numRows}).`);
    }
    const col: number[] = [];
    for (let jdx = 0; jdx < this.numRows; jdx++) {
      col[jdx] = this[jdx][idx];
    }
    return new Vector(...col);
  }

  /**
   * Update col by index
   * @param {number} idx - index of col to update
   * @param {number[]} col - vector for updating col
   */
  setColumn(idx: number, col: number[]) {
    if (col.length !== this.numRows) {
      throw new Error(`[ROW] Column must have the same length (cols = ${this.numRows}).`);
    }
    for (let jdx = 0; jdx < this.numRows; jdx++) {
      this[jdx][idx] = col[jdx];
    }
  }

  /**
   * Axis-wise operation on matrix
   * @remarks
   * Applies a callback
   * ```javascript
   * const f = (f: Vector) => Vector
   * ```
   * to all rows/columns depending on the axis
   * @param {function (Vector): Vector} f - callback to execute over the axis
   * @param {"row" | "column"} axis - axis for executing the callback
   * @returns {Matrix} Matrix after vectorized execution
   */
  vectorApply(f: VectorizedFunction, axis: AxisType = 'row'): Matrix {
    if (axis === 'row') {
      const result: NumberMatrix = [];
      for (let idx = 0; idx < this.numRows; idx++) {
        result[idx] = f(this.getRow(1));
      }
      return new Matrix(...result);
    }

    const copy = new Matrix(...this);
    for (let idx = 0; idx < this.numCols; idx++) {
      copy.setColumn(idx, f(this.getColumn(idx)));
    }

    return copy;
  }

  /**
   * Vectorized accumulation function
   * @remarks
   * Similar to simple arrays accumulation function, but
   * can be applied to a given axis
   * @param {function (Vector): Vector} f - Accumulation function
   * @param {"row" | "column"} axis 
   * @returns {Vector} Accumulated vector
   */
  vectorReduce(f: VectorizedAccFunction, axis: AxisType = 'row'): Vector {
    if (axis === 'row') {
      if (this.numRows === 1) {
        throw new Error(
          '[MATACC] Unable to accumulate because matrix has less than two rows',
        );
      }
      let result = new Vector(...this.getRow(0));
      for (let idx = 1; idx < this.numRows; idx++) {
        result = f(result, this.getRow(idx));
      }
      return result;
    }
    if (this.numCols === 1) {
      throw new Error(
        '[MATACC] Unable to accumulate because matrix has less than two columns',
      );
    }
    let result = new Vector(...this.getColumn(0));
    for (let idx = 1; idx < this.numCols; idx++) {
      result = f(result, this.getColumn(idx));
    }
    return result;
  }
}