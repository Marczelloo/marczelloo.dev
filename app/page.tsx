import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import AboutMe from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 px-4 sm:px-6 md:px-10 lg:px-24 max-w-7xl mx-auto">
      <Hero />
      <AboutMe />
      <Projects />
      <Contact />
    </div>
  );
}
