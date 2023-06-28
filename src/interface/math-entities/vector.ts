import { Matrix } from "./matrix";

type NumberMatrix = Array<Array<number>>;
type DotReturnType<T> =
  T extends Vector ? number :
  T extends number ? Vector : unknown;

/**
 * Class for modelling Vector elementary
 * operations
 * @remarks
 * The operations implemented include
 * 1. addition of vectors
 * 1. dot product
 * 1. multiplication by scalar
 * 1. outer product
 * 1. Euclidean norm
*/
export class Vector extends Array<number> {
  /**
   * Dot product of two vectors
   * @param {Vector} b - Vector for dot product
   * @returns {number} dot product result
   */
  vectorDot(b: Vector): number {
    if (this.length !== b.length) {
      throw new Error(`[VECMUL] Vectors must have the same length (a = ${this.length}, b = ${b.length})`);
    }
    let sum = 0;
    for (let i = 0; i < this.length; i++) {
      sum += this[i] * b[i];
    }
    return sum;
  }

  /**
   * Outer product of two vectors
   * @remarks
   * This operation produces a matrix that corresponds to all
   * possible product combinations of elements of the
   * vectors
   * @param {Vector} b - Vector for product 
   * @returns {Matrix} Matrix with products of elements
   */
  outerDot(b: Vector): Matrix {
    const result: NumberMatrix = [];
    for (let i = 0; i < this.length; i++) {
      result[i] = [];
      for (let j = 0; j < b.length; j++) {
        result[i][j] = this[i] * b[j];
      }
    }
    return new Matrix(...result);
  }

  /**
   * Multiplication by scalar
   * @param {number} b - Scalar for product
   * @returns {Vector} Vector multiplied by scalar
  */
  numberDot(b: number): Vector {
    const prod: number[] = [];
    for (let i = 0; i < this.length; i++) {
      prod[i] = this[i] * b;
    }
    return new Vector(...prod);
  }

  /**
   * General vector multiplication
   * @remarks
   * If the argument is a scalar, returns scalar multiplication
   * If the argument is a vector, returns dot product
   * @param {T} b - Vector for dot product
   * @returns {DotReturnType<T>} dot product result
  */
  dot<T>(b: T): DotReturnType<T> {
    if (b instanceof Vector) {
      return this.vectorDot(b) as DotReturnType<T>;
    }
    if (typeof b === 'number') {
      return this.numberDot(b) as DotReturnType<T>;
    }
    throw new Error(`[VECMUL] Input must be vectors or numbers`);
  }

  /**
   * Vector addition
   * @param {Vector} b - Vector for addition
   * @returns {Vector} result of vector addition
  */
  add(b: Vector): Vector {
    if (this.length !== b.length) {
      throw new Error(`[VECADD] Vectors must have the same length (a = ${this.length}, b = ${b.length})`);
    }
    let sum: number[] = [];
    for (let i = 0; i < this.length; i++) {
      sum[i] = this[i] * b[i];
    }
    return new Vector(...sum);
  }

  /**
   * Vector euclidean norm
   * @returns {number} euclidean norm
  */
  norm(): number {
    let sum = 0;
    for (let i = 0; i < this.length; i++) {
      sum += this[i] * this[i];
    }
    return Math.sqrt(sum);
  }
}