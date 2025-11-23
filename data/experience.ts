export interface Experience {
  id: number;
  position: string;
  company: string;
  dateRange: string;
  location: string;
  technologies: string[];
  responsibilities: string[];
}

export const experiences: Experience[] = [
  {
    id: 1,
    position: "Software Development Intern",
    company: "Hurtopony",
    dateRange: "May 2023",
    location: "Sosnowiec, Poland",
    technologies: ["PHP", "HTML/CSS", "MySQL"],
    responsibilities: [
      "Developed a PHP-based reporting system that generated operational and logistics reports using real company data",
      "Designed and optimized MySQL queries to analyze order, delivery, and inventory datasets",
      "Created internal calculation tools, including a tire replacement calculator and delivery cost calculator",
      "Improved and refactored existing internal scripts, increasing maintainability and reliability",
      "Collaborated with staff to adapt reporting tools to daily business needs and workflow requirements",
    ],
  },
  {
    id: 2,
    position: "Full-Stack Intern",
    company: "RecodeIT",
    dateRange: "May 2024",
    location: "Katowice, Poland",
    technologies: ["Next.js", "TypeScript", "T3 Stack", "Tailwind", "PostgreSQL", "Drizzle ORM"],
    responsibilities: [
      "Built and expanded full-stack features using the T3 Stack as part of my first production-oriented project with this technology",
      "Extended an internal employee management panel by enhancing the company’s leave and holiday management system",
      "Implemented responsive UI components and improved existing user flows using Tailwind CSS",
      "Collaborated with developers during code reviews to maintain high code quality and consistency",
      "Supported deployment workflows and participated in monitoring application performance",
      "Gained hands-on experience with full-stack architecture, database schema design, and integrating backend logic with modern frontend frameworks",
    ],
  },
  {
    id: 3,
    position: "Full-Stack Developer (contract work)",
    company: "D9 Space (RecodeIT)",
    dateRange: "2024",
    location: "Katowice, Poland",
    technologies: ["PHP", "WordPress (Custom Plugins & Backend Logic)"],
    responsibilities: [
      "Designing and implementing the booking logic",
      "Integrating the module with the client’s existing system",
      "Preparing an administration interface for managing bookings",
      "Implementing data validation and a simple reservation state flow",
      "Tailoring the solution to specific business requirements",
    ],
  },
];
