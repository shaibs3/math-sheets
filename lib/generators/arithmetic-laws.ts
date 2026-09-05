import { createRng } from "../rng";
import type { Rng } from "../rng";
import type { Generator, Problem } from "../types";

type Law =
  | "commutative-add"
  | "commutative-multiply"
  | "associative-add"
  | "associative-multiply"
  | "distributive";

const lawsByLevel: Record<number, Law[]> = {
  1: ["commutative-add", "commutative-multiply"],
  2: ["associative-add", "associative-multiply", "commutative-add"],
  3: ["distributive", "associative-multiply"],
};

function commutativeAdd(rng: Rng, bound: number): Problem {
  const a = rng.int(2, bound);
  const b = rng.int(2, bound);
  return rng.bool()
    ? {
        prompt: `${a} + ${b} = ___ + ${a}`,
        answer: String(b),
        work: "none",
        dir: "ltr",
      }
    : {
        prompt: `${a} + ${b} = ${b} + ___`,
        answer: String(a),
        work: "none",
        dir: "ltr",
      };
}

function commutativeMultiply(rng: Rng, bound: number): Problem {
  const a = rng.int(2, bound);
  const b = rng.int(2, bound);
  return rng.bool()
    ? {
        prompt: `${a} × ${b} = ___ × ${a}`,
        answer: String(b),
        work: "none",
        dir: "ltr",
      }
    : {
        prompt: `${a} × ${b} = ${b} × ___`,
        answer: String(a),
        work: "none",
        dir: "ltr",
      };
}

function associativeAdd(rng: Rng, bound: number): Problem {
  const a = rng.int(2, bound);
  const b = rng.int(2, bound);
  const c = rng.int(2, bound);
  return rng.bool()
    ? {
        prompt: `(${a} + ${b}) + ${c} = ${a} + (${b} + ___)`,
        answer: String(c),
        work: "none",
        dir: "ltr",
      }
    : {
        prompt: `${a} + (${b} + ${c}) = (${a} + ___) + ${c}`,
        answer: String(b),
        work: "none",
        dir: "ltr",
      };
}

function associativeMultiply(rng: Rng, bound: number): Problem {
  const a = rng.int(2, bound);
  const b = rng.int(2, bound);
  const c = rng.int(2, bound);
  return rng.bool()
    ? {
        prompt: `(${a} × ${b}) × ${c} = ${a} × (${b} × ___)`,
        answer: String(c),
        work: "none",
        dir: "ltr",
      }
    : {
        prompt: `${a} × (${b} × ${c}) = (___ × ${b}) × ${c}`,
        answer: String(a),
        work: "none",
        dir: "ltr",
      };
}

function distributive(rng: Rng): Problem {
  const a = rng.int(3, 9);
  const tens = rng.int(1, 9) * 10;
  const ones = rng.int(1, 9);
  return rng.bool()
    ? {
        prompt: `${a} × ${tens + ones} = ${a} × ${tens} + ${a} × ___`,
        answer: String(ones),
        work: "lines",
        dir: "ltr",
      }
    : {
        prompt: `${a} × (${tens} + ${ones}) = ___ × ${tens} + ${a} × ${ones}`,
        answer: String(a),
        work: "lines",
        dir: "ltr",
      };
}

const boundByLevel: Record<number, number> = { 1: 10, 2: 12, 3: 12 };

const arithmeticLaws: Generator = {
  id: "arithmetic-laws",
  columns: 2,
  defaultCount: 12,
  generate: ({ seed, count, level }) => {
    const rng = createRng(seed);
    const problems: Problem[] = [];
    const laws = lawsByLevel[level];
    const bound = boundByLevel[level];

    for (let i = 0; i < count; i++) {
      const law = laws[i % laws.length];
      if (law === "commutative-add") problems.push(commutativeAdd(rng, bound));
      else if (law === "commutative-multiply") problems.push(commutativeMultiply(rng, bound));
      else if (law === "associative-add") problems.push(associativeAdd(rng, bound));
      else if (law === "associative-multiply") problems.push(associativeMultiply(rng, bound));
      else problems.push(distributive(rng));
    }

    return problems;
  },
};

export default arithmeticLaws;
