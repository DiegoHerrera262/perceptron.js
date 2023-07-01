export type ActivationFunction = (a: number) => number;
export type ImplementedActivationFunction =
  'sigmoid' |
  'tanh' |
  'reLU' |
  'swish';

export interface LayerDefinition {
  numNeurons: number;
  activation: ImplementedActivationFunction;
  initialValues?: number[];
}
