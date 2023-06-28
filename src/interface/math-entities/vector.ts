export class Vector extends Array<number> {
  dot(b: Vector) {
    if (this.length !== b.length) {
      throw new Error(`[VECMUL] Vectors must have the same length (a = ${this.length}, b = ${b.length})`);
    }
    let sum = 0;
    for (let i = 0; i < this.length; i++) {
      sum += this[i] * b[i];
    }
    return sum;
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
    return Math.sqrt(this.dot(this));
  }
}