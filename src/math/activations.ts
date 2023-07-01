import {
  ImplementedActivationFunction,
  ActivationFunction,
} from '../interface';

const sigmoid = (a: number): number => {
  return 1 / (1 + Math.exp(-a));
};
const sigmoidGradient = (a: number): number => {
  return sigmoid(a) * (1 - sigmoid(a));
};

const tanh = (a: number): number => {
  return 2*sigmoid(2*a) - 1;
};
const tanhGradient = (a: number): number => {
  return 2/(1 + Math.exp(-2*a)) - 1;
};

const reLU = (a: number): number => {
  return Math.max(0, a);
};
const reLUGradient = (a: number): number => {
  return a > 0 ? 1 : 0;
};

const swish = (a: number): number => {
  return a * sigmoid(a);
};
const swishGradient = (a: number): number => {
  return sigmoid(a) + a * sigmoid(a) * (1 - sigmoid(a));
};

export const activations: Record<
  ImplementedActivationFunction, ActivationFunction
> = {
  sigmoid,
  tanh,
  reLU,
  swish,
};

export const activationGradients: Record<
  ImplementedActivationFunction, ActivationFunction
> = {
  sigmoid: sigmoidGradient,
  tanh: tanhGradient,
  reLU: reLUGradient,
  swish: swishGradient,
};

export const getActivationFunctionByKey = (
  key: ImplementedActivationFunction,
): {
  activation: ActivationFunction,
  activationGradient: ActivationFunction,
} => ({
  activation: activations[key],
  activationGradient: activationGradients[key],
});
