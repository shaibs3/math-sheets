import type { Generator } from "../types";
import absoluteValueEquation from "./absolute-value-equation";
import addSub100 from "./add-sub-100";
import addSub20 from "./add-sub-20";
import addSubTens from "./add-sub-tens";
import addSubVertical from "./add-sub-vertical";
import algebraicFractions from "./algebraic-fractions";
import algebraicSubstitution from "./algebraic-substitution";
import angles from "./angles";
import areaShapes from "./area-shapes";
import average from "./average";
import boxVolumeSurface from "./box-volume-surface";
import circle from "./circle";
import coordinatePoints from "./coordinate-points";
import coordinateSlope from "./coordinate-slope";
import coordinateTable from "./coordinate-table";
import clock from "./clock";
import collectLikeTerms from "./collect-like-terms";
import compareNumbers from "./compare-numbers";
import compositeArea from "./composite-area";
import compoundInterest from "./compound-interest";
import conditionalProbability from "./conditional-probability";
import congruentTriangles from "./congruent-triangles";
import consumerPercent from "./consumer-percent";
import cylinder from "./cylinder";
import decimalMultiplyDivide from "./decimal-multiply-divide";
import decimalUnits from "./decimal-units";
import decimalsOperations from "./decimals-operations";
import distancePoints from "./distance-points";
import distributiveExpand from "./distributive-expand";
import divideRemainder from "./divide-remainder";
import divideTwoDigit from "./divide-two-digit";
import divisibility from "./divisibility";
import divisibility369 from "./divisibility-369";
import equationWordProblems from "./equation-word-problems";
import evenOdd from "./even-odd";
import exponentialEquation from "./exponential-equation";
import exponentialGrowth from "./exponential-growth";
import factorTrinomial from "./factor-trinomial";
import factoring from "./factoring";
import formulaRearrange from "./formula-rearrange";
import fractionOfQuantity from "./fraction-of-quantity";
import fractionSimplify from "./fraction-simplify";
import fractionToDecimal from "./fraction-to-decimal";
import fractionsAddSubtract from "./fractions-add-subtract";
import fractionsDivide from "./fractions-divide";
import fractionsMultiply from "./fractions-multiply";
import functionValue from "./function-value";
import improperMixed from "./improper-mixed";
import lengthUnits from "./length-units";
import lineFromPoints from "./line-from-points";
import linearEquation from "./linear-equation";
import linearEquationBrackets from "./linear-equation-brackets";
import linearFunction from "./linear-function";
import linearGraph from "./linear-graph";
import linearInequality from "./linear-inequality";
import linearSystem from "./linear-system";
import longDivision from "./long-division";
import midpoint from "./midpoint";
import money from "./money";
import multiplyDivide20 from "./multiply-divide-20";
import multiplyPowersTen from "./multiply-powers-ten";
import multiplyTable from "./multiply-table";
import multiplyVertical from "./multiply-vertical";
import numberLineMissing from "./number-line-missing";
import orderOfOperations from "./order-of-operations";
import kiteProperties from "./kite-properties";
import parabola from "./parabola";
import parallelogramProperties from "./parallelogram-properties";
import percent from "./percent";
import percentChange from "./percent-change";
import placeValue from "./place-value";
import powerLaws from "./power-laws";
import powers from "./powers";
import powersRoots from "./powers-roots";
import primes from "./primes";
import probabilityBasic from "./probability-basic";
import pythagoras from "./pythagoras";
import quadraticEquation from "./quadratic-equation";
import quadraticOptimum from "./quadratic-optimum";
import quadrilateralAngles from "./quadrilateral-angles";
import ratio from "./ratio";
import rectangleArea from "./rectangle-area";
import rectangleProperties from "./rectangle-properties";
import rhombusProperties from "./rhombus-properties";
import rightTriangleTrig from "./right-triangle-trig";
import rootLaws from "./root-laws";
import scale from "./scale";
import scientificNotation from "./scientific-notation";
import signedNumbers from "./signed-numbers";
import similarTriangles from "./similar-triangles";
import slopeRelations from "./slope-relations";
import solidsVolume from "./solids-volume";
import specialProducts from "./special-products";
import squareProperties from "./square-properties";
import speedDistanceTime from "./speed-distance-time";
import standardDeviation from "./standard-deviation";
import statisticsCenter from "./statistics-center";
import timeUnits from "./time-units";
import trapezoidProperties from "./trapezoid-properties";
import unitFraction from "./unit-fraction";
import volume from "./volume";
import wordAddSubBasic from "./word-add-sub-basic";
import wordFractionsDecimals from "./word-fractions-decimals";
import wordMoneyMeasure from "./word-money-measure";
import wordMultDiv from "./word-mult-div";
import wordRateAverage from "./word-rate-average";
import wordTwoStep from "./word-two-step";
import zScore from "./z-score";

import arithmeticLaws from "./arithmetic-laws";
import compareFractions from "./compare-fractions";
import functionTransform from "./function-transform";
import placeValueMillion from "./place-value-million";
import quadraticInequality from "./quadratic-inequality";
import quadraticSystem from "./quadratic-system";
import rationalEquation from "./rational-equation";

const generators: Generator[] = [
  absoluteValueEquation,
  addSub100,
  addSub20,
  addSubTens,
  addSubVertical,
  algebraicFractions,
  algebraicSubstitution,
  angles,
  areaShapes,
  average,
  boxVolumeSurface,
  circle,
  coordinatePoints,
  coordinateSlope,
  coordinateTable,
  clock,
  collectLikeTerms,
  compareNumbers,
  compositeArea,
  compoundInterest,
  conditionalProbability,
  congruentTriangles,
  consumerPercent,
  cylinder,
  decimalMultiplyDivide,
  decimalUnits,
  decimalsOperations,
  distancePoints,
  distributiveExpand,
  divideRemainder,
  divideTwoDigit,
  divisibility,
  divisibility369,
  equationWordProblems,
  evenOdd,
  exponentialEquation,
  exponentialGrowth,
  factorTrinomial,
  factoring,
  formulaRearrange,
  fractionOfQuantity,
  fractionSimplify,
  fractionToDecimal,
  fractionsAddSubtract,
  fractionsDivide,
  fractionsMultiply,
  functionValue,
  improperMixed,
  kiteProperties,
  lengthUnits,
  lineFromPoints,
  linearEquation,
  linearEquationBrackets,
  linearFunction,
  linearGraph,
  linearInequality,
  linearSystem,
  longDivision,
  midpoint,
  money,
  multiplyDivide20,
  multiplyPowersTen,
  multiplyTable,
  multiplyVertical,
  numberLineMissing,
  orderOfOperations,
  parabola,
  parallelogramProperties,
  percent,
  percentChange,
  placeValue,
  powerLaws,
  powers,
  powersRoots,
  primes,
  probabilityBasic,
  pythagoras,
  quadraticEquation,
  quadraticOptimum,
  quadrilateralAngles,
  ratio,
  rectangleArea,
  rectangleProperties,
  rhombusProperties,
  rightTriangleTrig,
  rootLaws,
  scale,
  scientificNotation,
  signedNumbers,
  similarTriangles,
  slopeRelations,
  solidsVolume,
  specialProducts,
  speedDistanceTime,
  squareProperties,
  standardDeviation,
  statisticsCenter,
  timeUnits,
  trapezoidProperties,
  unitFraction,
  volume,
  wordAddSubBasic,
  wordFractionsDecimals,
  wordMoneyMeasure,
  wordMultDiv,
  wordRateAverage,
  wordTwoStep,
  zScore,
  arithmeticLaws,
  compareFractions,
  functionTransform,
  placeValueMillion,
  quadraticInequality,
  quadraticSystem,
  rationalEquation,
];

export const generatorsById = new Map(generators.map((generator) => [generator.id, generator]));

export function getGenerator(id: string): Generator | undefined {
  return generatorsById.get(id);
}

export default generators;
