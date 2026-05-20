export interface MockStatInterview {
    id: string;
    date: string;
    topic: string;
    difficulty: "Easy" | "Medium" | "Hard";
    overallScore: number;
    hireRecommendation: "Strong Hire" | "Hire" | "Leaning Hire" | "No Hire";
    competencies: {
        technicalSkills: number;
        problemSolving: number;
        communication: number;
        culturalFit: number;
    };
}

export const MOCK_STATS_DATA: MockStatInterview[] = [
    {
        id: "1",
        date: "2026-03-01",
        topic: "Arrays & Hashing",
        difficulty: "Easy",
        overallScore: 3.8,
        hireRecommendation: "Leaning Hire",
        competencies: { technicalSkills: 4.0, problemSolving: 3.5, communication: 4.0, culturalFit: 4.5 },
    },
    {
        id: "2",
        date: "2026-03-05",
        topic: "Two Pointers",
        difficulty: "Medium",
        overallScore: 2.5,
        hireRecommendation: "No Hire",
        competencies: { technicalSkills: 2.0, problemSolving: 2.5, communication: 3.0, culturalFit: 4.0 },
    },
    {
        id: "3",
        date: "2026-03-08",
        topic: "Sliding Window",
        difficulty: "Medium",
        overallScore: 4.2,
        hireRecommendation: "Hire",
        competencies: { technicalSkills: 4.5, problemSolving: 4.0, communication: 4.0, culturalFit: 4.5 },
    },
    {
        id: "4",
        date: "2026-03-10",
        topic: "Stack",
        difficulty: "Easy",
        overallScore: 4.8,
        hireRecommendation: "Strong Hire",
        competencies: { technicalSkills: 5.0, problemSolving: 4.5, communication: 4.5, culturalFit: 5.0 },
    },
    {
        id: "5",
        date: "2026-03-12",
        topic: "Binary Search",
        difficulty: "Medium",
        overallScore: 3.5,
        hireRecommendation: "Leaning Hire",
        competencies: { technicalSkills: 3.5, problemSolving: 4.0, communication: 3.0, culturalFit: 4.0 },
    },
    {
        id: "6",
        date: "2026-03-15",
        topic: "Trees",
        difficulty: "Medium",
        overallScore: 3.0,
        hireRecommendation: "No Hire",
        competencies: { technicalSkills: 2.5, problemSolving: 3.0, communication: 3.5, culturalFit: 4.5 },
    },
    {
        id: "7",
        date: "2026-03-18",
        topic: "Trees",
        difficulty: "Hard",
        overallScore: 2.0,
        hireRecommendation: "No Hire",
        competencies: { technicalSkills: 1.5, problemSolving: 2.0, communication: 3.0, culturalFit: 4.0 },
    },
    {
        id: "8",
        date: "2026-03-20",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        overallScore: 3.9,
        hireRecommendation: "Hire",
        competencies: { technicalSkills: 4.0, problemSolving: 3.5, communication: 4.0, culturalFit: 4.5 },
    },
    {
        id: "9",
        date: "2026-03-22",
        topic: "Graphs",
        difficulty: "Medium",
        overallScore: 4.5,
        hireRecommendation: "Strong Hire",
        competencies: { technicalSkills: 4.5, problemSolving: 4.5, communication: 4.5, culturalFit: 5.0 },
    },
    {
        id: "10",
        date: "2026-03-25",
        topic: "Dynamic Programming",
        difficulty: "Hard",
        overallScore: 3.2,
        hireRecommendation: "Leaning Hire",
        competencies: { technicalSkills: 3.0, problemSolving: 3.5, communication: 3.0, culturalFit: 4.5 },
    },
    {
        id: "11",
        date: "2026-03-27",
        topic: "System Design",
        difficulty: "Hard",
        overallScore: 4.4,
        hireRecommendation: "Hire",
        competencies: { technicalSkills: 4.5, problemSolving: 4.0, communication: 4.5, culturalFit: 4.5 },
    },
    {
        id: "12",
        date: "2026-03-29",
        topic: "Arrays & Hashing",
        difficulty: "Medium",
        overallScore: 4.6,
        hireRecommendation: "Strong Hire",
        competencies: { technicalSkills: 4.5, problemSolving: 5.0, communication: 4.5, culturalFit: 5.0 },
    },
];
