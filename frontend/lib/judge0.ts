/**
 * Judge0 CE (via RapidAPI) integration helpers.
 *
 * Language IDs reference: https://ce.judge0.com/languages
 */

// Map from Monaco / internal language keys → Judge0 CE language IDs
export const JUDGE0_LANG_ID: Record<string, number> = {
  python: 71,       // Python 3
  javascript: 63,   // Node.js
  typescript: 74,   // TypeScript (Node)
  java: 62,         // Java (OpenJDK 13)
  cpp: 54,          // C++ (GCC 9.2)
  go: 60,           // Go
  rust: 73,         // Rust
}

const RAPIDAPI_KEY = (process.env.RAPID_API_KEY ?? process.env.RAPIDAPI_KEY ?? "").trim()
const RAPIDAPI_HOST = "judge0-ce.p.rapidapi.com"

export interface Judge0Submission {
  source_code: string
  language_id: number
  stdin?: string
  expected_output?: string
  cpu_time_limit?: number   // seconds
  memory_limit?: number     // KB
}

export interface Judge0Result {
  stdout: string | null
  stderr: string | null
  compile_output: string | null
  status: { id: number; description: string }
  time: string | null
  memory: number | null
}

// ---- Polling configuration ----
const POLL_INTERVAL_MS = 1000   // time between GET polls
const MAX_POLL_ATTEMPTS = 30    // give up after ~30 s

/** Status ids 1 (In Queue) and 2 (Processing) mean "not done yet". */
function isTerminal(statusId: number): boolean {
  return statusId !== 1 && statusId !== 2
}

/**
 * Poll GET /submissions/:token until the submission reaches a terminal
 * status (anything other than "In Queue" / "Processing").
 */
async function pollSubmission(token: string): Promise<Judge0Result> {
  const url =
    `https://${RAPIDAPI_HOST}/submissions/${token}?base64_encoded=false&fields=stdout,stderr,compile_output,status,time,memory`

  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
      },
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Judge0 poll error ${res.status}: ${text}`)
    }

    const result = (await res.json()) as Judge0Result

    if (result.status && isTerminal(result.status.id)) {
      return result
    }
    // Not done yet — wait a bit and poll again
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
  }

  throw new Error(`Judge0 polling timed out for token ${token}`)
}

/**
 * Submit a batch of submissions, receive tokens, then poll each token
 * until every submission reaches a terminal status.
 *
 * 1. POST /submissions/batch  →  [{ token }, …]
 * 2. GET  /submissions/:token  (repeated) until status is terminal
 */
export async function submitBatch(
  submissions: Judge0Submission[],
): Promise<Judge0Result[]> {
  // Step 1 — POST the batch; Judge0 returns an array of { token } objects
  const res = await fetch(
    `https://${RAPIDAPI_HOST}/submissions/batch?base64_encoded=false`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
      },
      body: JSON.stringify({ submissions }),
    },
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Judge0 batch submit error ${res.status}: ${text}`)
  }

  const tokens: { token: string }[] = await res.json()

  if (!Array.isArray(tokens) || tokens.length === 0) {
    throw new Error("Judge0 batch returned no tokens")
  }

  // Step 2 — poll each token in parallel until all reach a terminal status
  return Promise.all(tokens.map((t) => pollSubmission(t.token)))
}

// ---------------------------------------------------------------------------
// Wrapper templates – these wrap the user's code so it reads from stdin
// and prints a canonical JSON output that we can diff against expectedOutput.
// ---------------------------------------------------------------------------

/**
 * Builds a full source string that:
 *  1. Includes the user's code verbatim
 *  2. Appends a small driver that reads stdin (nums + target)
 *     and prints the sorted result as a JSON array or "null".
 *
 * This is intentionally Two-Sum-specific for now.  Extend per-problem later.
 */
export function wrapTwoSum(userCode: string, language: string): string {
  switch (language) {
    case "python":
      return `
import json, sys

# --- user code start ---
${userCode}
# --- user code end ---

def _driver():
    data = sys.stdin.read().strip().split("\\n")
    nums = json.loads(data[0])
    target = int(data[1])
    if "twoSum" in dir() or "twoSum" in globals():
        result = twoSum(nums, target)
    elif "solution" in dir() or "solution" in globals():
        result = solution(nums, target)
    else:
        result = None
    if result is None:
        print("null")
    elif isinstance(result, (list, tuple)) and len(result) >= 2:
        print(json.dumps(sorted(result), separators=(',', ':')))
    else:
        print("null")

_driver()
`

    case "javascript":
      return `
const readline = require('readline');
// --- user code start ---
${userCode}
// --- user code end ---

const _lines = [];
const _rl = readline.createInterface({ input: process.stdin });
_rl.on('line', l => _lines.push(l));
_rl.on('close', () => {
  const nums = JSON.parse(_lines[0]);
  const target = Number(_lines[1]);
  let result;
  if (typeof twoSum === 'function') result = twoSum(nums, target);
  else if (typeof solution === 'function') result = solution(nums, target);
  else result = null;
  if (result == null) console.log("null");
  else console.log(JSON.stringify([...result].sort((a,b)=>a-b)));
});
`

    case "typescript":
      return `
import * as readline from 'readline';
// --- user code start ---
${userCode}
// --- user code end ---

const _lines: string[] = [];
const _rl = readline.createInterface({ input: process.stdin });
_rl.on('line', (l: string) => _lines.push(l));
_rl.on('close', () => {
  const nums: number[] = JSON.parse(_lines[0]);
  const target: number = Number(_lines[1]);
  const fn =
    typeof twoSum === 'function'
      ? twoSum
      : (typeof solution === 'function' ? solution : null);
  const result = fn ? fn(nums, target) : null;
  if (result == null) console.log("null");
  else console.log(JSON.stringify([...result].sort((a,b)=>a-b)));
});
`

    case "java":
      return `
import java.util.*;
import java.io.*;
import org.json.simple.*;

// --- user code start ---
${userCode}
// --- user code end ---

class Main {
  public static void main(String[] args) throws Exception {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    String numsLine = br.readLine();
    int target = Integer.parseInt(br.readLine().trim());
    // parse JSON array manually (simple)
    numsLine = numsLine.trim();
    numsLine = numsLine.substring(1, numsLine.length()-1); // remove [ ]
    String[] parts = numsLine.isEmpty() ? new String[0] : numsLine.split(",");
    int[] nums = new int[parts.length];
    for(int i=0;i<parts.length;i++) nums[i]=Integer.parseInt(parts[i].trim());
    int[] res = Solution.twoSum(nums, target);
    if(res == null) { System.out.println("null"); return; }
    Arrays.sort(res);
    System.out.println("["+res[0]+","+res[1]+"]");
  }
}
`

    case "cpp":
      return `
#include <iostream>
#include <vector>
#include <algorithm>
#include <sstream>
#include <string>
using namespace std;

// --- user code start ---
${userCode}
// --- user code end ---

int main(){
  string line;
  getline(cin, line);
  // parse JSON array
  vector<int> nums;
  string inner = line.substr(1, line.size()-2);
  if(!inner.empty()){
    stringstream ss(inner);
    string tok;
    while(getline(ss,tok,',')){
      nums.push_back(stoi(tok));
    }
  }
  int target;
  cin >> target;
  vector<int> res = twoSum(nums, target);
  if(res.empty()){ cout<<"null"<<endl; return 0; }
  sort(res.begin(),res.end());
  cout<<"["<<res[0]<<","<<res[1]<<"]"<<endl;
  return 0;
}
`

    case "go":
      return `
package main

import (
  "bufio"
  "encoding/json"
  "fmt"
  "os"
  "sort"
)

// --- user code start ---
${userCode}
// --- user code end ---

func main(){
  scanner := bufio.NewScanner(os.Stdin)
  scanner.Scan()
  numsLine := scanner.Text()
  scanner.Scan()
  var target int
  fmt.Sscanf(scanner.Text(), "%d", &target)
  var nums []int
  json.Unmarshal([]byte(numsLine), &nums)
  result := twoSum(nums, target)
  if result == nil {
    fmt.Println("null")
  } else {
    sort.Ints(result)
    out, _ := json.Marshal(result)
    fmt.Println(string(out))
  }
}
`

    case "rust":
      return `
use std::io::{self, BufRead};

// --- user code start ---
${userCode}
// --- user code end ---

fn main(){
  let stdin = io::stdin();
  let mut lines = stdin.lock().lines();
  let nums_line = lines.next().unwrap().unwrap();
  let target_line = lines.next().unwrap().unwrap();
  let nums_str = nums_line.trim().trim_matches(|c| c=='[' || c==']');
  let nums: Vec<i64> = if nums_str.is_empty() {
    vec![]
  } else {
    nums_str.split(',').map(|s| s.trim().parse().unwrap()).collect()
  };
  let target: i64 = target_line.trim().parse().unwrap();
  match two_sum(&nums, target) {
    Some(mut v) => { v.sort(); println!("[{},{}]", v[0], v[1]); }
    None => println!("null"),
  }
}
`

    default:
      // Fallback: just return user code as-is
      return userCode
  }
}

/**
 * Returns the number of lines the wrapper inserts BEFORE the user code.
 * Used by the route to translate script-level line numbers back to editor line numbers.
 */
export function wrapperLineOffset(language: string): number {
  switch (language) {
    case "python":      return 4   // blank, import, blank, comment
    case "javascript":  return 3   // blank, require, comment
    case "typescript":  return 3
    case "java":        return 6   // blank, imports×3, blank, comment
    case "cpp":         return 8   // blank, includes×5, using, blank, comment
    case "go":          return 10  // blank, package, blank, imports, blank, comment
    case "rust":        return 4
    default:            return 0
  }
}
