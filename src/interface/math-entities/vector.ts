type DotReturnType<T> =
  T extends Vector ? number :
  T extends number ? Vector : unknown;

export class Vector extends Array<number> {
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

  numberDot(b: number): Vector {
    const prod: number[] = [];
    for (let i = 0; i < this.length; i++) {
      prod[i] = this[i] * b;
    }
    return new Vector(...prod);
  }

  dot<T>(b: T): DotReturnType<T> {
    if (b instanceof Vector) {
      return this.vectorDot(b) as DotReturnType<T>;
    }
    if (typeof b === 'number') {
      return this.numberDot(b) as DotReturnType<T>;
    }
    throw new Error(`[VECMUL] Input must be vectors or numbers`);
  }

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

  norm(): number {
    let sum = 0;
    for (let i = 0; i < this.length; i++) {
      sum += this[i] * this[i];
    }
    return Math.sqrt(sum);
  }
}