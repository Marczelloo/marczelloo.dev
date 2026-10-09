import Hero from "./_components/Hero";
import Work from "./_components/Work";
import Process from "./_components/Process";
import Journey from "./_components/Journey";
import Contact from "./_components/Contact";

export default function Home() {
  return (
    <main className="grain" id="page-root">
      <Hero />
      <Work />
      <Process />
      <Journey />
      <Contact />
    </main>
  );
}
