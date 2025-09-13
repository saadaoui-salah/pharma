"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b py-4 px-6 flex items-center justify-between bg-white/60 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-3">
        <span className="sr-only">Accueil AntBioSuisse</span>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">AB</div>
        <span className="font-semibold text-lg">AntBioSuisse</span>
      </Link>
      <nav className="flex gap-6 items-center">
        <Link href="/" className="text-sm hover:underline">Accueil</Link>
        <Link href="/references" className="text-sm hover:underline">Références</Link>
        <Link href="/about" className="text-sm hover:underline">À-propos</Link>
        <Link href="/legal" className="text-sm hover:underline">Légal</Link>
      </nav>
    </header>
  );
}
