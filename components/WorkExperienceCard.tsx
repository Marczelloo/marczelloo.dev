import { Experience } from "@/data/experience";

export default function WorkExperienceCard({ experience }: { experience: Experience }) {
  return (
    <div className="bg-card/80 border border-border rounded-xl p-5 md:p-6 space-y-1">
      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
        <h3 className="font-semibold text-base md:text-lg text-(--text-primary)">
          {experience.position} — {experience.company}
        </h3>
        <span className="text-xs md:text-sm">
          {experience.dateRange} · {experience.location}
        </span>
      </div>
      <p className="text-xs md:text-sm italic mb-2">Tech: {experience.technologies.join(", ")}</p>
      <ul className="list-disc list-inside space-y-1">
        {experience.responsibilities.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
