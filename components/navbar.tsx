import Link from "next/link";
import { PersonIcon } from "./ui/icons/akar-icons-person";
import { EnvelopeIcon } from "./ui/icons/akar-icons-envelope";
import { FolderIcon } from "./ui/icons/akar-icons-folder";
import { HomeAlt1Icon } from "./ui/icons/akar-icons-home-alt1";

export default function Navbar() {
  return (
    <nav className="h-full bg-(--bg-primary) flex flex-col gap-10 border-r-2 border-(--border-subtle) px-6 py-8">
      <Link href={"#Hero"}>
        <HomeAlt1Icon size={28} />
      </Link>
      <Link href={"#AboutMe"}>
        <PersonIcon size={28} className="text-(--accent-primary)" />
      </Link>
      <Link href={"#Projects"}>
        <FolderIcon size={28} />
      </Link>
      <Link href={"#Contact"}>
        <EnvelopeIcon size={28} />
      </Link>
    </nav>
  );
}
