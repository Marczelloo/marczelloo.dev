import Hero from "./_components/Hero";
import Journey from "./_components/Journey";
import Craft from "./_components/Craft";
import About from "./_components/About";
import Contact from "./_components/Contact";
import SectionScrollController from "./_components/SectionScrollController";

export default function Home() {
  return (
    <main className="main-scroll" id="page-root">
      <SectionScrollController />
      <Hero />
      <Journey />
      <Craft />
      <About />
      <Contact />
    </main>
  );
}
