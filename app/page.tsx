import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import AboutMe from "@/components/About";
import Contact from "@/components/Contact";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 px-4 sm:px-6 md:px-10 lg:px-24 max-w-[1500px] mx-auto">
      <Reveal amount={0.25}>
        <Hero />
      </Reveal>

      <Reveal delay={0.25}>
        <AboutMe />
      </Reveal>

      <Reveal amount={0.35}>
        <Projects />
      </Reveal>

      <Reveal amount={0.4}>
        <Contact />
      </Reveal>
    </div>
  );
}
