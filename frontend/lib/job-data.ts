export interface Job {
  id: string
  title: string
  company: string
  location: string
  experience: string
  type: string
  role: string
  description: string
  requirements: string[]
  logo: string
  salary?: string
  skills?: string[]
  responsibilities?: string[]
  qualifications?: {
    required: string[]
    preferred?: string[]
  }
  techStack?: string[]
  benefits?: string[]
  companyOverview?: string
  interviewProcess?: string
  postedDate: string // ISO date string
  href: string
}

const JOB_DATABASE: Job[] = [
  {
    id: "1",
    title: "Software Engineer, AI/ML Infrastructure, Ads",
    company: "Google",
    location: "Pittsburgh, PA",
    experience: "2+ years",
    salary: "$141k - $202k",
    type: "Full-time",
    role: "Software Engineer",
    postedDate: "2026-01-20T10:00:00Z",
    description:
      "Develop next-generation scalable Machine Learning (ML) infrastructure for Google Ads. Work on massively scalable distributed systems that connect billions of users with relevant information.",
    skills: ["C++", "Machine Learning Infrastructure", "Distributed Systems"],
    requirements: [
      "2 years of experience with software development or 1 year with advanced degree",
      "2 years of experience developing and maintaining scalable ML infrastructure",
      "2 years of experience developing production quality software in C++",
    ],
    responsibilities: [
      "Write product or system development code for ML infrastructure",
      "Participate in design reviews to decide amongst technologies",
      "Review code developed by other developers and provide feedback",
      "Triage product or system issues and debug intricate distributed systems",
    ],
    qualifications: {
      required: [
        "Bachelor's degree or equivalent practical experience",
        "2+ years experience with C++ development",
        "2+ years experience with scalable ML infrastructure",
      ],
      preferred: [
        "Master's degree or PhD in Computer Science",
        "Experience architecting scalable distributed systems",
        "Strong knowledge of data structures and algorithms",
      ],
    },
    techStack: ["C++", "TensorFlow", "Borg", "MapReduce", "Flume"],
    benefits: [
      "Competitive base salary + bonus + equity",
      "Comprehensive health insurance (medical, dental, vision)",
      "401(k) matching",
      "Generous PTO and parental leave",
      "On-site gym and wellness programs",
      "Free meals and snacks",
    ],
    companyOverview:
      "Google's mission is to organize the world's information and make it universally accessible and useful. Our Ads teams build the technology that powers the open internet.",
    interviewProcess:
      "Interview includes: coding interviews (algorithms & data structures), system design (infrastructure/ML), and behavioral 'Googliness' assessment.",
    logo: "/companies/google.png",
    href: "https://www.google.com/about/careers/applications/jobs/results/100864950842335942-software-engineer-aiml-infrastructure-ads",
  },
  {
    id: "2",
    title: "Product Designer",
    company: "Meta",
    location: "Remote, US / Menlo Park, CA",
    experience: "6+ years",
    salary: "$170k - $236k",
    type: "Full-time",
    role: "UI/UX Designer",
    postedDate: "2026-01-20T14:30:00Z",
    description:
      "Shape innovative experiences for billions of users across Facebook, Instagram, WhatsApp, and Quest. Lead the entire design process from brainstorming strategic product innovations to pixel-perfect execution.",
    skills: ["Product Design", "Interaction Design", "Prototyping"],
    requirements: [
      "6+ years of experience designing complex software products",
      "Experience conducting research and driving design-led innovation",
      "Expertise in advanced prototyping and visual systems",
    ],
    responsibilities: [
      "Lead and deliver design projects of large and ambiguous scope",
      "Simplify complex actions into usable interfaces and flows",
      "Contribute to strategic decisions on future product direction",
      "Mentor designers and define visual systems",
    ],
    qualifications: {
      required: [
        "6+ years end-to-end product design experience",
        "Experience designing for complex software products",
        "Strong portfolio of interaction and visual design",
        "Experience leading cross-functional development efforts",
      ],
      preferred: [
        "Experience with functional prototypes",
        "Proven leadership and mentorship capabilities",
        "Ability to drive collaboration across related teams",
      ],
    },
    techStack: ["Figma", "Protopie", "Origami", "Design Systems"],
    benefits: [
      "Competitive base salary + bonus + equity",
      "Comprehensive medical/dental/vision benefits",
      "Family planning and reproductive health support",
      "Wellness benefits",
      "Remote work options",
    ],
    companyOverview:
      "Meta builds technologies that help people connect, find communities, and grow businesses. We're moving beyond 2D screens toward immersive experiences like augmented and virtual reality.",
    interviewProcess:
      "Interview includes: portfolio review, app critique, problem-solving exercise, and behavioral/leadership interviews.",
    logo: "/companies/meta.png",
    href: "https://www.metacareers.com/profile/job_details/1229945984832289",
  },
  {
    id: "3",
    title: "Machine Learning Engineer - Apple Music",
    company: "Apple",
    location: "Cupertino, CA",
    experience: "2+ years",
    salary: "$140k - $258k",
    type: "Full-time",
    role: "Machine Learning Engineer",
    postedDate: "2026-01-20T10:00:00Z",
    description:
      "Join the AIML team to shape the future of music discovery. Design and deploy LLM-powered models that combine machine learning and natural language understanding for Apple Music, Siri, and Spotlight.",
    skills: ["Machine Learning", "Generative AI", "Python", "LLMs"],
    requirements: [
      "2+ years experience in ML, NLP, IR, or LLM-based systems",
      "Strong programming skills in Python or C++",
      "Deep understanding of transformer architectures and embeddings",
    ],
    responsibilities: [
      "Build and deploy LLM-powered models to improve search relevance",
      "Design retrieval and ranking systems combining semantics and user context",
      "Analyze large-scale data to identify search quality improvements",
      "Ensure systems meet Apple's privacy and efficiency standards",
    ],
    qualifications: {
      required: [
        "B.S. or M.S. in Computer Science or Machine Learning",
        "2+ years experience with ML/LLM systems",
        "Experience with PyTorch, JAX, or TensorFlow",
        "Familiarity with retrieval/ranking models",
      ],
      preferred: [
        "Experience with music/media recommendation systems",
        "Background in vector databases or hybrid search",
        "Understanding of RLHF",
      ],
    },
    techStack: ["Python", "C++", "PyTorch", "Transformers", "Vector DB"],
    benefits: [
      "Competitive base pay and RSUs",
      "Comprehensive medical and dental",
      "Retirement benefits",
      "Employee stock purchase plan",
      "Educational reimbursement",
      "Product discounts",
    ],
    companyOverview:
      "Apple revolutionized personal technology with the Macintosh, iPhone, and iPad. We're committed to leaving the world better than we found it.",
    interviewProcess:
      "Interview includes: technical phone screens (coding/ML), system design for ML, and onsite loop with deep dives into architectures and behavioral questions.",
    logo: "/companies/apple.png",
    href: "https://jobs.apple.com/en-ca/details/200627683-3337/machine-learning-engineer-apple-music?team=SFTWR",
  },
  {
    id: "4",
    title: "Software Development Engineer, AGI",
    company: "Amazon",
    location: "Seattle, WA",
    experience: "3+ years",
    salary: "$140k - $220k",
    type: "Full-time",
    role: "Software Engineer",
    postedDate: "2026-01-20T11:00:00Z",
    description:
      "Join the Amazon AGI team to design and build scalable systems to responsibly access and process information from the web. Work on supporting generative AI projects.",
    skills: ["Python", "Spark", "Java", "Scala", "Machine Learning"],
    requirements: [
      "3+ years of non-internship professional software development experience",
      "Experience programming with at least one software programming language",
      "Experience determining technical needs of complex systems",
    ],
    responsibilities: [
      "Design and build scalable systems to responsibly access web information",
      "Optimize data processing architecture for performance and cost",
      "Develop pipelines to deploy ML models classifying petabyte-scale datasets",
      "Work with scientists to rapidly prototype new algorithms",
    ],
    qualifications: {
      required: [
        "3+ years of non-internship professional software development experience",
        "Experience programming with at least one software programming language",
      ],
      preferred: [
        "Bachelor's degree in computer science or equivalent",
        "Experience with distributed systems",
        "Experience with large-scale data processing",
      ],
    },
    techStack: ["Python", "Spark", "Java", "Scala", "AWS"],
    benefits: [
      "Competitive salary and RSU sign-on payments",
      "Comprehensive health/dental/vision insurance",
      "401(k) with company match",
      "Parental leave",
      "Amazon employee discount",
      "Mental health support and EAP",
    ],
    companyOverview:
      "Amazon is guided by four principles: customer obsession, passion for invention, commitment to operational excellence, and long-term thinking.",
    interviewProcess:
      "Interview includes: online assessment, technical phone screen, and onsite loop with coding, system design, and behavioral questions.",
    logo: "/companies/amazon.png",
    href: "https://www.amazon.jobs/en/jobs/3161333/software-development-engineer-agi",
  },
  {
    id: "5",
    title: "Director, Product Management, Plans and Pricing",
    company: "Netflix",
    location: "Los Gatos, CA",
    experience: "10+ years",
    salary: "$300k - $800k",
    type: "Full-time",
    role: "Product Manager",
    postedDate: "2026-01-19T13:00:00Z",
    description:
      "Lead global strategy for Netflix Plans and Pricing. Define member plans and own pricing execution to drive growth and monetization across 190+ countries.",
    skills: ["Product Strategy", "Monetization", "Pricing"],
    requirements: [
      "10+ years experience in monetization strategy or product management",
      "Experience with tiering, packaging, and commercial offerings",
      "Understanding of behavioral economics and market dynamics",
    ],
    responsibilities: [
      "Establish pricing recommendations for each country and plan",
      "Lead cross-functional team on price change planning",
      "Develop strategy for plan tiering and evolution",
      "Manage a team of Product Managers focused on pricing",
    ],
    qualifications: {
      required: [
        "10+ years strategy/product experience in monetization",
        "Direct to consumer business experience",
        "Experience leading and managing product managers",
      ],
      preferred: [
        "Global scope experience",
        "Strong background in behavioral economics",
        "Excellent communication with senior executives",
      ],
    },
    techStack: ["Data Science", "Consumer Insights", "Financial Modeling", "Strategy"],
    benefits: [
      "Top-of-market compensation (Salary + Stock options)",
      "True transparency and autonomy",
      "Unlimited vacation",
      "Premium health benefits",
      "Inclusive work environment",
    ],
    companyOverview:
      "Netflix is one of the world's leading entertainment services with over 300 million paid memberships. We offer true freedom and responsibility.",
    interviewProcess:
      "Interview includes: recruiter screen, Monetization/Pricing strategy case, leadership interviews, and culture match assessment.",
    logo: "/companies/netflix.png",
    href: "https://explore.jobs.netflix.net/careers/job/790313192085?microsite=netflix.com",
  },
  {
    id: "7",
    title: "Software Engineer 1",
    company: "Intuit",
    location: "New York, New York",
    experience: "Entry Level",
    salary: "$57.50 - $78.00 / hr",
    type: "Full-time",
    role: "Software Engineer",
    postedDate: "2026-01-20T16:55:00Z",
    description:
      "Come join the QuickBooks Indirect Tax Filing & Reporting as a Software Engineer 1, to work with great-minded engineers shaping the future of Tax Filing through AI and emerging technologies.",
    skills: [
      "Java",
      "Kotlin",
      "React"
    ],
    requirements: [
      "Bachelor's degree in computer science or a related technical field",
      "Solid understanding of software engineering principles and best practices",
      "Extensive programming experience with one or more of the following: Java, Kotlin",
      "Frontend knowledge and/or experience and extensive knowledge in React and JavaScript",
      "Strong written, verbal, and collaboration skills"
    ],
    responsibilities: [
      "Participate in all software engineering process activities and collaborate with the team members to deliver high-quality and on-time solutions",
      "Apply best practices and strive to deliver the best quality for customers while staying passionate to learn and innovate",
      "Engage with customers to get a first-hand understanding of their needs",
      "Implement features, products, and enhancements that improve the user experience"
    ],
    qualifications: {
      required: [
        "Bachelor's degree in computer science or a related technical field",
        "Solid understanding of software engineering principles and best practices",
        "Extensive programming experience with one or more of the following: Java, Kotlin",
        "Frontend knowledge and/or experience and extensive knowledge in React and JavaScript",
        "Strong written, verbal, and collaboration skills",
        "Self-starter with a strong work ethic and a passion for problem-solving",
        "Ability to thrive in a fast-paced, dynamic environment"
      ],
      preferred: [
        "Flexibility and ability to adapt to changing priorities and technologies"
      ]
    },
    techStack: [
      "Java",
      "Kotlin",
      "React",
      "JavaScript",
      "AI/Emerging Technologies"
    ],
    benefits: [
      "Competitive compensation package with strong pay for performance rewards",
      "Eligible for cash bonus, equity rewards, and benefits",
      "Lateral growth opportunities (mobility between teams/roles)",
      "Inclusive culture valuing diverse experiences"
    ],
    companyOverview:
      "Intuit is the global financial technology platform that powers prosperity for the people and communities we serve. With approximately 100 million customers worldwide using products such as TurboTax, Credit Karma, QuickBooks, and Mailchimp, we believe that everyone should have the opportunity to prosper.",
    interviewProcess:
      "Interview process typically includes an initial recruiter screen, technical assessments, and behavioral conversations. Intuit values diverse experiences and welcomes applicants with criminal record histories in accordance with Fair Chance Acts.",
    logo: "/companies/intuit.png",
    href: "https://jobs.intuit.com/job/new-york/software-engineer-1/27595/89635832160?glat=43.255210876464844&glon=-79.9310302734375&cid=seo_google"
  },


  {
    id: "8",
    title: "Principal Software Engineering Manager - Data Science & Engineering",
    company: "Microsoft",
    location: "Redmond, WA / Remote",
    experience: "8+ years",
    salary: "$140k - $275k",
    type: "Full-time",
    role: "Engineering Manager",
    postedDate: "2026-01-15T10:00:00Z",
    description:
      "Join the MSRC Data Science team to build data pipelines, ML models, and insights for security. Lead a team combining data science with engineering to provide unique insights into customer scenarios.",
    skills: ["Machine Learning", "Data Engineering"],
    requirements: [
      "Bachelor's Degree in Computer Science or related field",
      "6+ years technical engineering experience with coding (C#, Python, etc.)",
      "Experience leading teams in building ML/ETL pipelines",
    ],
    responsibilities: [
      "Lead team on disciplined use of AI tools and practices across SDLC",
      "Guide architecture of scalable data pipelines and datasets",
      "Coach team on engineering health measures and responsible AI practices",
      "Drive incident retrospectives and operational excellence",
    ],
    qualifications: {
      required: [
        "Bachelor's Degree in Computer Science or related field",
        "6+ years technical engineering experience with coding",
        "Ability to pass Microsoft Cloud background check",
      ],
      preferred: [
        "Master's Degree and 8+ years experience",
        "4+ years people management experience",
        "Experience guiding architecture of scalable pipelines",
      ],
    },
    techStack: ["Azure", "Python", "C#", "Machine Learning", "ETL"],
    benefits: [
      "Competitive base pay ($140k - $304k depending on location)",
      "Comprehensive healthcare",
      "Stock awards and bonuses",
      "Generous parental leave",
      "World-class professional development",
    ],
    companyOverview:
      "Microsoft's mission is to empower every person and every organization on the planet to achieve more. We are committed to cultivating an inclusive work environment for all employees.",
    interviewProcess:
      "Interview includes: technical deep dives, leadership assessment, system design (ML/Data), and final round with senior leadership.",
    logo: "/companies/microsoft.png",
    href: "https://apply.careers.microsoft.com/careers?query=engineering+manager&start=0&pid=1970393556654705&sort_by=relevance",
  },
]

export function getJobs(): Job[] {
  return JOB_DATABASE
}

export function getJobById(id: string): Job | undefined {
  return JOB_DATABASE.find((job) => job.id === id)
}

const favoritedJobIds = new Set<string>()

export function getFavoritedJobs(): Job[] {
  return JOB_DATABASE.filter((job) => favoritedJobIds.has(job.id))
}

export function toggleFavoriteJob(jobId: string): boolean {
  if (favoritedJobIds.has(jobId)) {
    favoritedJobIds.delete(jobId)
    return false
  } else {
    favoritedJobIds.add(jobId)
    return true
  }
}

export function isFavorited(jobId: string): boolean {
  return favoritedJobIds.has(jobId)
}

// Helper to normalize job titles to interview roles
export function normalizeJobTitleToRole(title: string): string {
  const lowerTitle = title.toLowerCase()

  if (
    lowerTitle.includes("software engineer") ||
    lowerTitle.includes("engineering manager") ||
    lowerTitle.includes("frontend engineer") ||
    lowerTitle.includes("backend engineer") ||
    lowerTitle.includes("full stack") ||
    lowerTitle.includes("sde")
  ) {
    return "Software Engineer"
  }

  if (
    lowerTitle.includes("product manager") ||
    lowerTitle.includes("product management") ||
    lowerTitle.includes("growth pm") ||
    lowerTitle.includes("technical pm")
  ) {
    return "Product Manager"
  }

  if (lowerTitle.includes("designer") || lowerTitle.includes("ux") || lowerTitle.includes("ui")) {
    return "UI/UX Designer"
  }

  if (lowerTitle.includes("marketing")) {
    return "Marketing Manager"
  }

  if (
    lowerTitle.includes("data scientist") ||
    lowerTitle.includes("ml engineer") ||
    lowerTitle.includes("machine learning")
  ) {
    return "Data Scientist"
  }

  if (
    lowerTitle.includes("devops") ||
    lowerTitle.includes("infrastructure") ||
    lowerTitle.includes("site reliability") ||
    lowerTitle.includes("sre")
  ) {
    return "DevOps Engineer"
  }

  return "Software Engineer"
}

// Helper to format posted date
export function formatPostedDate(isoDate: string): string {
  const posted = new Date(isoDate)
  const now = new Date()
  const diffInMs = now.getTime() - posted.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays <= 6) {
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} minutes ago`
      }
      return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`
    }
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`
  } else {
    const day = String(posted.getDate()).padStart(2, "0")
    const month = String(posted.getMonth() + 1).padStart(2, "0")
    const year = String(posted.getFullYear()).slice(-2)
    return `${day}/${month}/${year}`
  }
}
