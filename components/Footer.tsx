export default function Footer() {
  return (
    <footer className="w-full mt-12 py-6 border-t-2 border-border text-center text-(--text-muted) text-sm">
      © {new Date().getFullYear()} Marczelloo.dev. All rights reserved.
    </footer>
  );
}
