export default function HeroButtons() {
  return (
    <>
      <Button size="lg" className="cursor-pointer">
        See My Projects
      </Button>
      <Button variant="outline" size="lg" className="cursor-pointer">
        <DownloadIcon className="mr-2" />
        Download CV
      </Button>
    </>
  );
}
