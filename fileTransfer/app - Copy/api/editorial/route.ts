import { NextResponse } from "next/server"

/**
 * API endpoint to serve the editorial solution from the backend.
 * The actual editorial content is defined in backend/editorial.py.
 * 
 * For now, this returns a hardcoded editorial. To dynamically read from
 * backend/editorial.py, you would need to either:
 * 1. Copy editorial.py content to a JSON file that Next.js can read
 * 2. Set up a separate backend API server
 * 3. Use environment variables to pass the editorial
 * 
 * Since this is a Next.js frontend-only route, we'll hardcode it here
 * and you can update it when you change the problem.
 */

const EDITORIAL_SOLUTION_CODE = `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        prevMap = {}  # val -> index

        for i, n in enumerate(nums):
            diff = target - n
            if diff in prevMap:
                return [prevMap[diff], i]
            prevMap[n] = i
        return prevMap`

export async function GET() {
  return NextResponse.json({
    code: EDITORIAL_SOLUTION_CODE,
  })
}
