import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeSearch from "./components/HomeSearch";

async function getDomaines() {
  try {
    const res = await fetch((process.env.NEXT_PUBLIC_API_BASE || "") + "/api/domaines/", { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

export default async function Home() {
  const domaines = await getDomaines();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="text-center py-12">
          <h1 className="text-3xl sm:text-4xl font-semibold mb-4">Recommandations d’antibiothérapie adultes en Suisse</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Recommandations d’antibiothérapie adultes en Suisse, basées sur le guide CHUV 2022
          </p>
        </section>

        <section className="flex justify-center">
          <HomeSearch initialDomaines={domaines} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
