import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import AboutMe from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div className="flex flex-col gap-20">
      <Hero />
      <AboutMe />
      <Projects />
      <Contact />
    </div>
  );
}
