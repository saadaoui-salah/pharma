export default function Footer() {
  return (
    <footer className="w-full border-t py-6 px-6 text-sm text-center bg-transparent">
      <div>
        © AntBioSuisse {new Date().getFullYear()} — Usage professionnel uniquement, ne remplace pas le jugement clinique
      </div>
      <div className="mt-2 flex justify-center gap-4">
        <a href="/legal" className="underline text-sm">Mentions légales</a>
        <a href="/references" className="underline text-sm">Références</a>
      </div>
    </footer>
  );
}
