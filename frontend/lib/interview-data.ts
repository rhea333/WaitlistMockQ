export interface InterviewRound {
  round: number
  title: string
  subtitle?: string
  duration: string
  questions: string[]
  hasCoding?: boolean
  completed?: boolean
}

export interface InterviewData {
  id: string
  role: string
  company?: string
  date: string
  overallScore: number
  totalRounds: number
  completedRounds: number
  rounds: InterviewRound[]
  scores: Record<string, number>
}

// Role-specific scoring categories
export const ROLE_SCORE_CATEGORIES: Record<string, string[]> = {
  "Software Engineer": ["Code Quality", "Correctness", "Reasoning", "System Design"],
  "Product Manager": ["Product Sense", "Execution", "Strategy", "Communication"],
  "UI/UX Designer": ["UX Thinking", "Visual Design", "Accessibility", "Problem Solving"],
  "Marketing Manager": ["Campaign Strategy", "Metrics", "Positioning", "Execution"],
  "Data Scientist": ["Statistical Analysis", "ML Knowledge", "Communication", "Problem Solving"],
  "DevOps Engineer": ["Infrastructure", "Automation", "Security", "Problem Solving"],
}

// Role-specific interview plans
export const INTERVIEW_PLANS: Record<string, Omit<InterviewRound, "completed">[]> = {
  "Software Engineer": [
    {
      round: 1,
      title: "Screening Interview",
      duration: "15 min",
      questions: [
        "Can you walk me through your background and recent technical experience?",
        "What kind of engineering problems do you enjoy most?",
      ],
      hasCoding: false,
    },
    {
      round: 2,
      title: "Coding",
      subtitle: "Data Structures & Algorithms",
      duration: "60 min",
      questions: [
        "Given an array of integers, return the two numbers that add up to a target.",
        "Can you explain your approach and time complexity?",
      ],
      hasCoding: true,
    },
    {
      round: 3,
      title: "System Design",
      duration: "60 min",
      questions: ["Design a scalable URL shortening service.", "How would you handle traffic spikes?"],
      hasCoding: false,
    },
    {
      round: 4,
      title: "Behavioral",
      duration: "30 min",
      questions: [
        "Tell me about a time you disagreed with an engineering decision.",
        "How do you handle tradeoffs between speed and quality?",
      ],
      hasCoding: false,
    },
  ],
  "Product Manager": [
    {
      round: 1,
      title: "Screening Interview",
      duration: "15 min",
      questions: ["Tell me about your product background.", "Why product management?"],
      hasCoding: false,
    },
    {
      round: 2,
      title: "Product Sense",
      duration: "45 min",
      questions: ["Design a feature to improve creator retention on Instagram.", "What metrics would you track?"],
      hasCoding: false,
    },
    {
      round: 3,
      title: "Execution",
      duration: "45 min",
      questions: [
        "How would you prioritize these competing roadmap items?",
        "How do you work with engineering under tight deadlines?",
      ],
      hasCoding: false,
    },
    {
      round: 4,
      title: "Behavioral",
      duration: "30 min",
      questions: ["Tell me about a product failure.", "How do you handle stakeholder conflict?"],
      hasCoding: false,
    },
  ],
  "UI/UX Designer": [
    {
      round: 1,
      title: "Screening Interview",
      duration: "15 min",
      questions: ["Can you walk me through your design background?", "What kind of products do you enjoy designing?"],
      hasCoding: false,
    },
    {
      round: 2,
      title: "Design Challenge",
      duration: "60 min",
      questions: ["Redesign the onboarding flow for a finance app.", "What assumptions are you making?"],
      hasCoding: false,
    },
    {
      round: 3,
      title: "UX Critique",
      duration: "45 min",
      questions: ["Critique this checkout flow.", "What accessibility improvements would you make?"],
      hasCoding: false,
    },
    {
      round: 4,
      title: "Behavioral",
      duration: "30 min",
      questions: ["Tell me about a time design feedback was difficult to hear."],
      hasCoding: false,
    },
  ],
  "Marketing Manager": [
    {
      round: 1,
      title: "Screening Interview",
      duration: "15 min",
      questions: ["Tell me about your marketing background.", "What types of campaigns have you led?"],
      hasCoding: false,
    },
    {
      round: 2,
      title: "Campaign Strategy",
      duration: "45 min",
      questions: ["Launch a new SaaS product with a limited budget.", "Which channels would you prioritize and why?"],
      hasCoding: false,
    },
    {
      round: 3,
      title: "Metrics & Growth",
      duration: "45 min",
      questions: ["Which KPIs matter most post-launch?", "How would you run experiments?"],
      hasCoding: false,
    },
    {
      round: 4,
      title: "Behavioral",
      duration: "30 min",
      questions: ["Tell me about a campaign that didn't perform well."],
      hasCoding: false,
    },
  ],
  "Data Scientist": [
    {
      round: 1,
      title: "Screening Interview",
      duration: "15 min",
      questions: ["Tell me about your data science experience.", "What types of problems have you solved with ML?"],
      hasCoding: false,
    },
    {
      round: 2,
      title: "Technical Coding",
      subtitle: "Python & Statistics",
      duration: "60 min",
      questions: [
        "Write a function to calculate correlation between two datasets.",
        "How would you handle missing data?",
      ],
      hasCoding: true,
    },
    {
      round: 3,
      title: "ML System Design",
      duration: "60 min",
      questions: [
        "Design a recommendation system for an e-commerce platform.",
        "How would you evaluate model performance?",
      ],
      hasCoding: false,
    },
    {
      round: 4,
      title: "Behavioral",
      duration: "30 min",
      questions: ["Tell me about a time your model didn't perform as expected."],
      hasCoding: false,
    },
  ],
  "DevOps Engineer": [
    {
      round: 1,
      title: "Screening Interview",
      duration: "15 min",
      questions: ["Tell me about your DevOps experience.", "What infrastructure have you managed?"],
      hasCoding: false,
    },
    {
      round: 2,
      title: "Technical Coding",
      subtitle: "Scripting & Automation",
      duration: "60 min",
      questions: [
        "Write a script to monitor system health and send alerts.",
        "How would you optimize this deployment pipeline?",
      ],
      hasCoding: true,
    },
    {
      round: 3,
      title: "Infrastructure Design",
      duration: "60 min",
      questions: [
        "Design a CI/CD pipeline for a microservices architecture.",
        "How would you ensure high availability?",
      ],
      hasCoding: false,
    },
    {
      round: 4,
      title: "Behavioral",
      duration: "30 min",
      questions: ["Tell me about a production incident you handled."],
      hasCoding: false,
    },
  ],
}

// Role-specific performance summaries and recommendations
export const ROLE_PERFORMANCE_SUMMARIES: Record<
  string,
  {
    summary: string
    recommendations: string[]
  }
> = {
  "Software Engineer": {
    summary:
      "You demonstrated strong problem-solving skills and clear communication throughout the interview. Your technical knowledge was solid, and you explained your thought process effectively. Consider edge cases earlier in your solutions and work on analyzing complexity upfront.",
    recommendations: [
      "Practice identifying edge cases before writing code to improve solution robustness",
      "Work on analyzing time and space complexity earlier in your problem-solving process",
      "Consider multiple approaches before coding to ensure you're choosing the optimal solution",
    ],
  },
  "Product Manager": {
    summary:
      "Your product sense showed promise with thoughtful user-centered reasoning. You articulated tradeoffs clearly and demonstrated solid prioritization skills. Strengthen your metrics fluency and practice quantifying impact more rigorously.",
    recommendations: [
      "Develop a stronger framework for identifying and tracking key product metrics",
      "Practice structured prioritization with clear impact/effort assessments",
      "Strengthen your ability to communicate cross-functional tradeoffs with stakeholders",
    ],
  },
  "UI/UX Designer": {
    summary:
      "Your design thinking demonstrated strong user empathy and clear design rationale. You articulated usability principles well and showed attention to accessibility considerations. Continue refining your visual design execution and systems thinking.",
    recommendations: [
      "Strengthen your understanding of design systems and component reusability",
      "Practice articulating accessibility considerations earlier in your design process",
      "Develop stronger frameworks for evaluating competing design solutions",
    ],
  },
  "Marketing Manager": {
    summary:
      "You showed solid channel strategy and clear positioning instincts. Your approach to experimentation was thoughtful and metrics-aware. Deepen your understanding of attribution models and practice quantifying campaign ROI more precisely.",
    recommendations: [
      "Develop stronger frameworks for channel prioritization and budget allocation",
      "Practice building detailed measurement plans with clear success metrics upfront",
      "Strengthen your ability to articulate positioning in competitive markets",
    ],
  },
  "Data Scientist": {
    summary:
      "Your statistical reasoning was sound and you demonstrated solid ML fundamentals. You communicated technical concepts clearly and showed strong problem-solving instincts. Continue practicing end-to-end model deployment and production considerations.",
    recommendations: [
      "Strengthen your understanding of model deployment and monitoring in production",
      "Practice communicating statistical tradeoffs to non-technical stakeholders",
      "Develop stronger frameworks for feature engineering and data quality assessment",
    ],
  },
  "DevOps Engineer": {
    summary:
      "You demonstrated strong infrastructure knowledge and clear automation instincts. Your approach to reliability and monitoring was thoughtful. Continue developing your security expertise and practice designing for scale earlier in your solutions.",
    recommendations: [
      "Strengthen your understanding of infrastructure security best practices",
      "Practice designing systems with observability and monitoring built in from the start",
      "Develop stronger frameworks for capacity planning and cost optimization",
    ],
  },
}

// Mock interviews database
let interviewsDB: InterviewData[] = [
  {
    id: "1",
    role: "Software Engineer",
    company: "Google",
    date: "2026-01-15",
    overallScore: 75,
    totalRounds: 4,
    completedRounds: 2,
    rounds: INTERVIEW_PLANS["Software Engineer"].map((r, i) => ({ ...r, completed: i < 2 })),
    scores: {
      "Code Quality": 78,
      Correctness: 75,
      Reasoning: 72,
      "System Design": 75,
    },
  },
  {
    id: "2",
    role: "Product Manager",
    company: "Meta",
    date: "2026-01-10",
    overallScore: 92,
    totalRounds: 4,
    completedRounds: 4,
    rounds: INTERVIEW_PLANS["Product Manager"].map((r) => ({ ...r, completed: true })),
    scores: {
      "Product Sense": 95,
      Execution: 92,
      Strategy: 95,
      Communication: 88,
    },
  },
  {
    id: "3",
    role: "Software Engineer",
    company: "Apple",
    date: "2026-01-05",
    overallScore: 85,
    totalRounds: 4,
    completedRounds: 3,
    rounds: INTERVIEW_PLANS["Software Engineer"].map((r, i) => ({ ...r, completed: i < 3 })),
    scores: {
      "Code Quality": 88,
      Correctness: 85,
      Reasoning: 82,
      "System Design": 86,
    },
  },
  {
    id: "4",
    role: "Software Engineer",
    company: "Netflix",
    date: "2025-12-28",
    overallScore: 65,
    totalRounds: 4,
    completedRounds: 4,
    rounds: INTERVIEW_PLANS["Software Engineer"].map((r) => ({ ...r, completed: true })),
    scores: {
      "Code Quality": 55,
      Correctness: 60,
      Reasoning: 85,
      "System Design": 50,
    },
  },
  {
    id: "5",
    role: "Product Manager",
    company: "Shopify",
    date: "2025-12-20",
    overallScore: 72,
    totalRounds: 4,
    completedRounds: 4,
    rounds: INTERVIEW_PLANS["Product Manager"].map((r) => ({ ...r, completed: true })),
    scores: {
      "Product Sense": 85,
      Execution: 82,
      Strategy: 80,
      Communication: 90,
    },
  },
]

export function getInterviews(): InterviewData[] {
  return interviewsDB.slice(0, 10) // Return only 10 most recent
}

export function getInterviewById(id: string): InterviewData | undefined {
  return interviewsDB.find((i) => i.id === id)
}

export function addInterview(interview: Omit<InterviewData, "id">): InterviewData {
  const newInterview: InterviewData = {
    ...interview,
    id: Date.now().toString(),
  }
  interviewsDB = [newInterview, ...interviewsDB]
  return newInterview
}

export function updateInterviewProgress(id: string, completedRounds: number): void {
  const interview = interviewsDB.find((i) => i.id === id)
  if (interview) {
    interview.completedRounds = completedRounds
    interview.rounds = interview.rounds.map((r, i) => ({
      ...r,
      completed: i < completedRounds,
    }))
  }
}
