import { Project } from "@/data/projects";
import Image from "next/image";
import { Button } from "./ui/button";
import { techIcons } from "@/data/techIcons";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-2 h-[330px] bg-card rounded-lg p-4 border border-border">
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
      <p className="text-(--text-secondary) grow"> {project.description} </p>
      <div className="flex aling-center gap-4 justify-center mt-2">
        <Button variant={"outline"} size={"lg"} className="w-1/2">
          GitHub
        </Button>
        <Button variant={"outline"} size={"lg"} className="w-1/2">
          Live Demo
        </Button>
      </div>
      <div className="flex gap-4 mt-2 justify-center items-center">
        {project.tags.map((tag) => {
          const Icon = techIcons[tag.toLowerCase().replace(".", "")];
          return Icon ? (
            <Tooltip key={tag}>
              <TooltipTrigger asChild>
                <div className="cursor-pointer">
                  <Icon size={28} className="grayscale hover:grayscale-0 hover:scale-125 transition-all duration-300" />
                </div>
              </TooltipTrigger>
              <TooltipContent
                sideOffset={6}
                className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-subtle)]"
              >
                {tag}
              </TooltipContent>
            </Tooltip>
          ) : null;
        })}
      </div>
    </div>
  );
}
