import { Project } from "@/data/projects";
import Image from "next/image";
import { Button } from "./ui/button";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-2 h-72 bg-card rounded-lg p-4 border border-border">
      <div className="flex gap-4">
        <Image
          src={project.image}
          alt={project.title}
          width={80}
          height={80}
          className="rounded-md border-border border"
        />
        <p className="text-3xl font-semibold"> {project.title} </p>
      </div>
      <p className="text-(--text-secondary)"> {project.description} </p>
      <div className="flex aling-center gap-4 justify-center mt-2">
        <Button variant={"outline"} size={"lg"} className="w-1/2">
          GitHub
        </Button>
        <Button variant={"outline"} size={"lg"} className="w-1/2">
          Live Demo
        </Button>
      </div>
    </div>
  );
}
