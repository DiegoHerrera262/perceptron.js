import { Matrix, Vector } from '../../src';

describe('Vector class is implemented correctly', () => {
  let vectorA: Vector;
  let vectorB: Vector;
  let vectorC: Vector;

  beforeEach(() => {
    vectorA = new Vector(1, 2, 3);
    vectorB = new Vector(4, 5, 6);
    vectorC = new Vector(1, 2, 3, 4);
  });

  test('Vector dot product is implemented correctly', () => {
    const dotProduct = vectorA.dot(vectorB);
    expect(dotProduct).toBe(1 * 4 + 2 * 5 + 3 * 6);
  });

  test('Vector outer product is implemented correctly', () => {
    const outerProduct = vectorA.outerDot(vectorC);
    const expectedMatrix = new Matrix(
      [1, 2, 3, 4],
      [2, 4, 6, 8],
      [3, 6, 9, 12],
    );
    const diffMatrix = expectedMatrix.add(
      outerProduct.dot(-1),
    );
    expect(diffMatrix.norm()).toBeCloseTo(0);
  });

  test('Vector multiplication by scalar is implemented correctly', () => {
    const scalarProduct = vectorA.numberDot(2);
    expect(scalarProduct[0]).toBe(2);
    expect(scalarProduct[1]).toBe(4);
    expect(scalarProduct[2]).toBe(6);
  });

  test('Direct product is implemented correctly', () => {
    const directProduct = vectorA.directDot(vectorB);
    expect(directProduct[0]).toBe(4);
    expect(directProduct[1]).toBe(10);
    expect(directProduct[2]).toBe(18);
  });

  test('Vector addition is implemented correctly', () => {
    const sum = vectorA.add(vectorB);
    expect(sum[0]).toBe(5);
    expect(sum[1]).toBe(7);
    expect(sum[2]).toBe(9);
  });

  test('Vector norm is implemented correctly', () => {
    const norm = vectorA.norm();
    expect(norm).toBeCloseTo(Math.sqrt(1 + 4 + 9));
  });

  test('Vector application is implemented correctly', () => {
    const result = vectorA.apply((x) => x * 2);
    expect(result[0]).toBe(2);
    expect(result[1]).toBe(4);
    expect(result[2]).toBe(6);
  });
});