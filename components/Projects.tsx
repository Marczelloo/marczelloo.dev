import ProjectCard from "./projectCard";
import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <section id="Projects" className="w-full">
      <h2 className="text-4xl font-semibold text-(--accent-primary)">My Projects</h2>
      <div className="grid grid-cols-4 gap-8 mt-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
