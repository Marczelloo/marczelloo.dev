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
    description: "A Discord music bot via Vibe.",
    github: "https://github.com/Marczelloo/neobeat-buddy",
    liveDemo: "https://...",
    image: "/projects/neobeatbuddy.png",
    tags: ["Discord.js", "Node.js", "MongoDB"],
  },
  {
    id: 2,
    title: "BookHaven",
    description: "Online Boskurro builda MVC architekk,unim Node.js.",
    github: "https://github.com/...",
    liveDemo: "https://...",
    image: "/projects/bookhaven.png",
    tags: ["React", "Node.js", "PostgreSQL", "AI"],
  },
  {
    id: 1,
    title: "NeoBeat Buddy",
    description: "A Discord music bot via Vibe.",
    github: "https://github.com/Marczelloo/neobeat-buddy",
    liveDemo: "https://...",
    image: "/projects/neobeatbuddy.png",
    tags: ["Discord.js", "Node.js", "MongoDB"],
  },
  {
    id: 2,
    title: "BookHaven",
    description: "Online Boskurro builda MVC architekk,unim Node.js.",
    github: "https://github.com/...",
    liveDemo: "https://...",
    image: "/projects/bookhaven.png",
    tags: ["React", "Node.js", "PostgreSQL", "AI"],
  },
  {
    id: 1,
    title: "NeoBeat Buddy",
    description: "A Discord music bot via Vibe.",
    github: "https://github.com/Marczelloo/neobeat-buddy",
    liveDemo: "https://...",
    image: "/projects/neobeatbuddy.png",
    tags: ["Discord.js", "Node.js", "MongoDB"],
  },
  {
    id: 2,
    title: "BookHaven",
    description: "Online Boskurro builda MVC architekk,unim Node.js.",
    github: "https://github.com/...",
    liveDemo: "https://...",
    image: "/projects/bookhaven.png",
    tags: ["React", "Node.js", "PostgreSQL", "AI"],
  },
  {
    id: 1,
    title: "NeoBeat Buddy",
    description: "A Discord music bot via Vibe.",
    github: "https://github.com/Marczelloo/neobeat-buddy",
    liveDemo: "https://...",
    image: "/projects/neobeatbuddy.png",
    tags: ["Discord.js", "Node.js", "MongoDB"],
  },
  {
    id: 2,
    title: "BookHaven",
    description: "Online Boskurro builda MVC architekk,unim Node.js.",
    github: "https://github.com/...",
    liveDemo: "https://...",
    image: "/projects/bookhaven.png",
    tags: ["React", "Node.js", "PostgreSQL", "AI"],
  },
];
