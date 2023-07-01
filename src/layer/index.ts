import {
  ActivationFunction,
  ImplementedActivationFunction,
  LayerDefinition,
} from '../interface';
import {
  Matrix,
  Vector,
  getActivationFunctionByKey,
} from '../math';

const invalidateLayerParams = () => {
  throw new Error('[LAYC] Layer must have at least one value');
};

export class DenseVectorLayer extends Vector {
  activationKey: ImplementedActivationFunction;
  activation: ActivationFunction;
  activationGradient: ActivationFunction;

  constructor(params: LayerDefinition) {
    const { initialValues, numNeurons, activation } = params;

    const initialValuesLength = Number(initialValues?.length ?? 0);
    const emptyLayer =
      (!!initialValues && initialValuesLength <= 0) ||
      (!initialValues && numNeurons < 0);
    if (emptyLayer) {
      invalidateLayerParams();
    }

    let fillValues: number[] = [];
    if (!!initialValues && initialValuesLength > 0) {
      fillValues = [...initialValues];
    }
    if (!initialValues && numNeurons > 0) {
      const zeros = Array(numNeurons).fill(0);
      fillValues = [...zeros];
    }

    if (fillValues.length <= 0) {
      invalidateLayerParams();
    }

    super(...fillValues);
    const { activation: keyActivation, activationGradient } = getActivationFunctionByKey(activation);
    this.activationKey = activation;
    this.activation = keyActivation;
    this.activationGradient = activationGradient;
  }

  forwardPass({
    weights,
    bias,
    activation = 'sigmoid',
  }: {
    weights: Matrix;
    bias: Vector;
    activation: ImplementedActivationFunction;
  }): DenseVectorLayer {
    const rawValues = bias.add(
      weights.dot(this)
    ).apply(this.activation);
    return new DenseVectorLayer({
      numNeurons: rawValues.length,
      initialValues: rawValues,
      activation,
    });
  }

  backwardPass({
    weights,
    incomingGradient,
  }: {
    weights: Matrix;
    incomingGradient: Vector;
  }): Vector {
    return weights.transpose().dot(
      incomingGradient,
    ).directDot(
      this.apply(this.activationGradient)
    );
  }
}
