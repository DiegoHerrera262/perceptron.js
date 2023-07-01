import { Matrix, Vector } from '../../src';

describe('Matrix class is implemented correctly', () => {
  let testMatrixA: Matrix;
  let testMatrixB: Matrix;
  let testVector: Vector;
  
  beforeEach(() => {
    testMatrixA = new Matrix(
      [1/4, 1/3],
      [1/5, 1/7],
    );
    testMatrixB = new Matrix(
      [4, 3, 1],
      [5, 7, 8],
    );
    testVector = new Vector(1, 2);
  });

  test('Allocates Matrix correctly', () => {
    expect(testMatrixA.numRows).toBe(2);
    expect(testMatrixA.numCols).toBe(2);
  });

  test('Adds Matrix correctly', () => {
    const addMatrix = testMatrixA.add(testMatrixA);
    expect(addMatrix.numRows).toBe(2);
    expect(addMatrix.numCols).toBe(2);
    expect(addMatrix[0][0]).toBeCloseTo(2/4);
    expect(addMatrix[0][1]).toBeCloseTo(2/3);
    expect(addMatrix[1][0]).toBeCloseTo(2/5);
    expect(addMatrix[1][1]).toBeCloseTo(2/7);
  });

  test('Multiplies Matrices correctly', () => {
    const productMatrix = testMatrixA.dot(testMatrixB);
    expect(productMatrix.numRows).toBe(2);
    expect(productMatrix.numCols).toBe(3);
    expect(productMatrix[0][0]).toBeCloseTo(1 + 5/3);
    expect(productMatrix[0][1]).toBeCloseTo(3/4 + 7/3);
    expect(productMatrix[0][2]).toBeCloseTo(1/4 + 8/3);
    expect(productMatrix[1][0]).toBeCloseTo(4/5 + 5/7);
    expect(productMatrix[1][1]).toBeCloseTo(3/5 + 1);
    expect(productMatrix[1][2]).toBeCloseTo(1/5 + 8/7);
  });

  test('Multiplies Matrices correctly (with transpose)', () => {
    const productMatrix = testMatrixA.dot(testMatrixB, true);
    expect(productMatrix.numRows).toBe(2);
    expect(productMatrix.numCols).toBe(3);
    expect(productMatrix[0][0]).toBeCloseTo(1 + 1);
    expect(productMatrix[0][1]).toBeCloseTo(3 / 4 + 7 / 5);
    expect(productMatrix[0][2]).toBeCloseTo(1 / 4 + 8 / 5);
    expect(productMatrix[1][0]).toBeCloseTo(4 / 3 + 5 / 7);
    expect(productMatrix[1][1]).toBeCloseTo(1 + 1);
    expect(productMatrix[1][2]).toBeCloseTo(1 / 3 + 8 / 7);
  });

  test('Multiplies by Vector Correctly', () => {
    const productVector = testMatrixA.dot(testVector);
    expect(productVector.length).toBe(2);
    expect(productVector[0]).toBeCloseTo(1/4 + 2/3);
    expect(productVector[1]).toBeCloseTo(1/5 + 2/7);
  });

  test('Multiplies by Number Correctly', () => {
    const productMatrix = testMatrixA.dot(4);
    expect(productMatrix[0][0]).toBeCloseTo(1);
    expect(productMatrix[0][1]).toBeCloseTo(4/3);
    expect(productMatrix[1][0]).toBeCloseTo(4/5);
    expect(productMatrix[1][1]).toBeCloseTo(4/7);
  });

  test('Transposes Matrix correctly', () => {
    const transposeMatrix = testMatrixB.transpose();
    expect(transposeMatrix.numRows).toBe(3);
    expect(transposeMatrix.numCols).toBe(2);
    expect(transposeMatrix[0][0]).toBeCloseTo(4);
    expect(transposeMatrix[0][1]).toBeCloseTo(5);
    expect(transposeMatrix[1][0]).toBeCloseTo(3);
    expect(transposeMatrix[1][1]).toBeCloseTo(7);
    expect(transposeMatrix[2][0]).toBeCloseTo(1);
    expect(transposeMatrix[2][1]).toBeCloseTo(8);
  });

  test('Computes 1-norm correctly', () => {
    const norm = testMatrixA.norm();
    expect(norm).toBeCloseTo(
      1/4 + 1/3 + 1/5 + 1/7,
    );
  });

  test('Matrix apply is implemented correctly', () => {
    const matrixApply = testMatrixA.apply((x) => 2 * x);
    expect(matrixApply[0][0]).toBeCloseTo(2/4);
    expect(matrixApply[0][1]).toBeCloseTo(2/3);
    expect(matrixApply[1][0]).toBeCloseTo(2/5);
    expect(matrixApply[1][1]).toBeCloseTo(2/7);
  });

  test('Matrix gets row correctly', () => {
    const randomIndex =
      Math.min(
        Math.max(
          Math.floor(Math.random() * (testMatrixB.numRows + 1)),
          0,
        ),
        testMatrixB.numRows - 1,
      );
    const row = testMatrixB.getRow(randomIndex);
    expect(row[0]).toBeCloseTo(testMatrixB[randomIndex][0]);
    expect(row[1]).toBeCloseTo(testMatrixB[randomIndex][1]);
    expect(row[2]).toBeCloseTo(testMatrixB[randomIndex][2]);
  });
});