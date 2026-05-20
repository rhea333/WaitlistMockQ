/**
 * Test-case definitions for code evaluation.
 *
 * Each problem maps to an array of TestCase objects consumed by the
 * /api/run-code route.  `hidden` test cases are never shown to the user –
 * they only contribute to the pass count.
 */

export interface TestCase {
  /** Human-readable label, e.g. "Test 1" */
  label: string
  /** The value piped to stdin for the submitted program */
  input: string
  /** Expected stdout (trimmed before comparison) */
  expectedOutput: string
  /** If true the inputs/outputs are not revealed to the user */
  hidden?: boolean
}

// ---------------------------------------------------------------------------
// Helpers – build a stdin string that the wrapper template can parse
// ---------------------------------------------------------------------------

function twoSumInput(nums: number[], target: number): string {
  // Line 1: JSON array   Line 2: target
  return `${JSON.stringify(nums)}\n${target}`
}

function twoSumExpected(indices: number[] | null): string {
  if (indices === null) return "null"
  // Canonical output is the sorted pair as JSON array
  return JSON.stringify([...indices].sort((a, b) => a - b))
}

// ---------------------------------------------------------------------------
// Two Sum – 50 test cases
// ---------------------------------------------------------------------------

export const TWO_SUM_CASES: TestCase[] = [
  { label: "Test 1",  input: twoSumInput([2,7,11,15], 9),                         expectedOutput: twoSumExpected([0,1]) },
  { label: "Test 2",  input: twoSumInput([3,2,4], 6),                             expectedOutput: twoSumExpected([1,2]) },
  { label: "Test 3",  input: twoSumInput([3,3], 6),                               expectedOutput: twoSumExpected([0,1]) },
  { label: "Test 4",  input: twoSumInput([], 5),                                  expectedOutput: twoSumExpected(null) },
  { label: "Test 5",  input: twoSumInput([1], 1),                                 expectedOutput: twoSumExpected(null) },
  { label: "Test 6",  input: twoSumInput([1,2,3], 7),                             expectedOutput: twoSumExpected(null), hidden: true },
  { label: "Test 7",  input: twoSumInput([-1,-2,-3,-4,-5], -8),                   expectedOutput: twoSumExpected([2,4]) },
  { label: "Test 8",  input: twoSumInput([-3,4,3,90], 0),                         expectedOutput: twoSumExpected([0,2]) },
  { label: "Test 9",  input: twoSumInput([0,4,3,0], 0),                           expectedOutput: twoSumExpected([0,3]) },
  { label: "Test 10", input: twoSumInput([0,0], 0),                               expectedOutput: twoSumExpected([0,1]) },
  { label: "Test 11", input: twoSumInput([1,5,1,5], 10),                          expectedOutput: twoSumExpected([1,3]), hidden: true },
]

// ---------------------------------------------------------------------------
// Problem → Test-case registry
// ---------------------------------------------------------------------------

/** Maps problemId → test cases. Add new problems here. */
export const TEST_CASE_REGISTRY: Record<string, TestCase[]> = {
  "1": TWO_SUM_CASES,        // LeetCode-style id = 1
  "two-sum": TWO_SUM_CASES,  // slug alias
}
