import type { Generator } from "../types";
import addSub20 from "./add-sub-20";
import addSub100 from "./add-sub-100";
import addSubVertical from "./add-sub-vertical";
import areaShapes from "./area-shapes";
import average from "./average";
import boxVolumeSurface from "./box-volume-surface";
import circle from "./circle";
import clock from "./clock";
import compareNumbers from "./compare-numbers";
import decimalUnits from "./decimal-units";
import decimalsOperations from "./decimals-operations";
import divideRemainder from "./divide-remainder";
import divideTwoDigit from "./divide-two-digit";
import divisibility from "./divisibility";
import divisibility369 from "./divisibility-369";
import evenOdd from "./even-odd";
import fractionOfQuantity from "./fraction-of-quantity";
import fractionSimplify from "./fraction-simplify";
import fractionToDecimal from "./fraction-to-decimal";
import fractionsAddSubtract from "./fractions-add-subtract";
import fractionsDivide from "./fractions-divide";
import fractionsMultiply from "./fractions-multiply";
import improperMixed from "./improper-mixed";
import lengthUnits from "./length-units";
import longDivision from "./long-division";
import money from "./money";
import multiplyPowersTen from "./multiply-powers-ten";
import multiplyTable from "./multiply-table";
import multiplyVertical from "./multiply-vertical";
import numberLineMissing from "./number-line-missing";
import orderOfOperations from "./order-of-operations";
import percent from "./percent";
import placeValue from "./place-value";
import powers from "./powers";
import primes from "./primes";
import ratio from "./ratio";
import rectangleArea from "./rectangle-area";
import scale from "./scale";
import timeUnits from "./time-units";
import unitFraction from "./unit-fraction";
import volume from "./volume";
import wordAddSubBasic from "./word-add-sub-basic";

const generators: Generator[] = [
  addSub20,
  addSub100,
  addSubVertical,
  areaShapes,
  average,
  boxVolumeSurface,
  circle,
  clock,
  compareNumbers,
  decimalUnits,
  decimalsOperations,
  divideRemainder,
  divideTwoDigit,
  divisibility,
  divisibility369,
  evenOdd,
  fractionOfQuantity,
  fractionSimplify,
  fractionToDecimal,
  fractionsAddSubtract,
  fractionsDivide,
  fractionsMultiply,
  improperMixed,
  lengthUnits,
  longDivision,
  money,
  multiplyPowersTen,
  multiplyTable,
  multiplyVertical,
  numberLineMissing,
  orderOfOperations,
  percent,
  placeValue,
  powers,
  primes,
  ratio,
  rectangleArea,
  scale,
  timeUnits,
  unitFraction,
  volume,
  wordAddSubBasic,
];

export const generatorsById = new Map(generators.map((generator) => [generator.id, generator]));

export function getGenerator(id: string): Generator | undefined {
  return generatorsById.get(id);
}

export default generators;
