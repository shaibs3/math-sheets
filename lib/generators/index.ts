import type { Generator } from "../types";
import fractionsMultiply from "./fractions-multiply";
import fractionsDivide from "./fractions-divide";
import fractionsAddSubtract from "./fractions-add-subtract";
import fractionOfQuantity from "./fraction-of-quantity";
import decimalsOperations from "./decimals-operations";
import decimalUnits from "./decimal-units";
import percent from "./percent";
import ratio from "./ratio";
import scale from "./scale";
import circle from "./circle";
import volume from "./volume";

const generators: Generator[] = [
  fractionsMultiply,
  fractionsDivide,
  fractionsAddSubtract,
  fractionOfQuantity,
  decimalsOperations,
  decimalUnits,
  percent,
  ratio,
  scale,
  circle,
  volume,
];

export const generatorsById = new Map(generators.map((generator) => [generator.id, generator]));

export function getGenerator(id: string): Generator | undefined {
  return generatorsById.get(id);
}

export default generators;
