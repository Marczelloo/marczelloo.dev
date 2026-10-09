import Hero from "./_components/Hero";
import Work from "./_components/Work";
import Process from "./_components/Process";
import Journey from "./_components/Journey";
import Contact from "./_components/Contact";
import { getLiveStats } from "./_data/github";

export default async function Home() {
  const stats = await getLiveStats();

  return (
    <main className="grain" id="page-root">
      <Hero stats={stats} />
      <Work />
      <Process />
      <Journey />
      <Contact />
    </main>
  );
}
