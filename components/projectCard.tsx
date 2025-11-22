import { Project } from "@/data/projects";
import Image from "next/image";
import { Button } from "./ui/button";
import { techIcons } from "@/data/techIcons";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Link from "next/dist/client/link";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      className="flex flex-col bg-card rounded-xl p-5 border border-border transition-all duration-200
    hover:-translate-y-1 hover:border-(--accent-primary)/40 hover:shadow-lg hover:shadow-(--accent-primary)/20"
    >
      <div className="flex gap-4 mb-3">
        <Image
          src={project.image}
          alt={project.title}
          width={80}
          height={80}
          className="rounded-md border-border border shrink-0"
        />
        <h3 className="text-2xl md:text-3xl font-semibold leading-tight">{project.title}</h3>
      </div>

      <p className="text-(--text-secondary) text-sm md:text-base flex-1">{project.description}</p>

      <div className="mt-4 flex items-center gap-4">
        <Link href={project.github} target="_blank" className="flex-1">
          <Button
            size="sm"
            className="w-full cursor-pointer bg-(--accent-primary) hover:bg-(--accent-hover) color-(--text-primary) border-0 text-sm transition-all duration-200"
          >
            GitHub
          </Button>
        </Link>
        <Link href={project.liveDemo ?? "#"} target="_blank" className="flex-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={!project.liveDemo}
            className="w-full cursor-pointer text-sm rounded-lg bg-(--accent-primary)/8 border border-(--accent-primary)/25 text-(--text-secondary) hover:bg-(--accent-primary)/18 hover:border-(--accent-primary)/40 hover:text-(--text-primary) disabled:bg-transparent disabled:border-white/5 disabled:text-(--text-muted) transition-all duration-200"
          >
            Live Demo
          </Button>
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 justify-center items-center">
        {project.tags.map((tag) => {
          const Icon = techIcons[tag.toLowerCase().replace(".", "")];
          return Icon ? (
            <Tooltip key={tag}>
              <TooltipTrigger asChild>
                <div className="cursor-pointer">
                  <Icon size={24} className="grayscale hover:grayscale-0 hover:scale-125 transition-all duration-300" />
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={6} className="bg-(--bg-tertiary) text-(--text-primary) border border-border">
                {tag}
              </TooltipContent>
            </Tooltip>
          ) : null;
        })}
      </div>
    </div>
  );
}
