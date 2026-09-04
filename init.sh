#!/usr/bin/env bash
set -uo pipefail

cd "$(dirname "$0")"

failures=()

run() {
  local name="$1"
  shift
  echo ""
  echo "=== $name ==="
  if "$@"; then
    echo "--- $name: PASS"
  else
    echo "--- $name: FAIL"
    failures+=("$name")
  fi
}

if [ ! -d node_modules ]; then
  echo "node_modules missing; running npm install"
  npm install || exit 1
fi

if [ ! -d .next/types ]; then
  echo "generating Next route types"
  npx next typegen >/dev/null 2>&1 || npx next build >/dev/null 2>&1 || true
fi

run "typecheck" npx tsc --noEmit
run "lint" npm run lint
run "tests" npm test

echo ""
echo "=== determinism guard ==="
banned=$(grep -rnE 'Math\.random|new Date\(|Date\.now|crypto\.' lib/generators lib/math.ts lib/mixed.ts 2>/dev/null || true)
if [ -n "$banned" ]; then
  echo "$banned"
  echo "--- determinism guard: FAIL (generators must draw randomness only from createRng(seed))"
  failures+=("determinism guard")
else
  echo "--- determinism guard: PASS"
fi

echo ""
echo "=== comment guard ==="
comments=$(grep -rnE '^\s*(//|/\*|\*)' --include='*.ts' --include='*.tsx' lib components app 2>/dev/null \
  | grep -vE '//\s*(eslint|@ts-|prettier|#)' || true)
if [ -n "$comments" ]; then
  echo "$comments"
  echo "--- comment guard: FAIL (this repo forbids code comments; use naming and structure)"
  failures+=("comment guard")
else
  echo "--- comment guard: PASS"
fi

echo ""
if [ ${#failures[@]} -eq 0 ]; then
  echo "ALL CHECKS PASSED"
  exit 0
fi

echo "FAILED: ${failures[*]}"
echo "Do not report work as done until every check above passes."
exit 1
