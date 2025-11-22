import { projects } from "@/data/projects";
import ProjectCard from "./projectCard";

export default function Projects() {
  return (
    <section id="Projects" className="w-full scroll-mt-16 md:scroll-mt-8">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-(--accent-text)">My Projects</h2>
        <span className="hidden md:block h-px flex-1 bg-linear-to-r from-(--accent-text)/70 to-transparent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mt-6 items-stretch">
        {" "}
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
