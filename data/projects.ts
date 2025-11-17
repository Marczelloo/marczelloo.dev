export interface Project {
  id: number;
  title: string;
  description: string;
  github: string;
  liveDemo?: string;
  image: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    id: 1,
    title: "NeoBeat Buddy",
    description:
      "A high-performance Discord music bot built with Discord.js, Lavalink and Poru — features slash-only controls, live equaliser presets, queue management, adaptive autoplay and a Docker-ready production stack.",
    github: "https://github.com/Marczelloo/neobeat-buddy",
    liveDemo: "https://...",
    image: "/projects/neobeatbuddy.png",
    tags: ["Node.js", "JavaScript", "Discord.js", "Lavalink"],
  },
  {
    id: 2,
    title: "BookHaven",
    description:
      "A full-stack online bookstore built with Node.js, Express and MongoDB. Features book browsing, multi-volume management, secure checkout logic and a clean MVC-style backend designed for easy expansion.",
    github: "https://github.com/...",
    liveDemo: "https://...",
    image: "/projects/bookhaven_.png",
    tags: ["Node.js", "JavaScript", "Express.js", "MongoDB", "EJS", "CSS"],
  },
];
