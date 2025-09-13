"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Domaine = { id: number; name: string };
type Pathologie = { id: number; name: string };

export default function HomeSearch({ initialDomaines }: { initialDomaines: Domaine[] }) {
  const router = useRouter();
  const [domaines, setDomaines] = useState<Domaine[]>(initialDomaines || []);
  const [selectedDomaine, setSelectedDomaine] = useState<number | null>(null);
  const [pathologies, setPathologies] = useState<Pathologie[]>([]);
  const [selectedPathologie, setSelectedPathologie] = useState<number | null>(null);
  const [q, setQ] = useState("");
  const [loadingDomaines, setLoadingDomaines] = useState(false);
  const [loadingPathos, setLoadingPathos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // keep initial domaines if provided; otherwise fetch
    if (!initialDomaines || initialDomaines.length === 0) {
      setLoadingDomaines(true);
      fetch((process.env.NEXT_PUBLIC_API_BASE || "") + "/api/domaines/")
        .then((r) => {
          if (!r.ok) throw new Error("Failed to load domaines");
          return r.json();
        })
        .then((data) => setDomaines(data))
        .catch(() => setDomaines([]))
        .finally(() => setLoadingDomaines(false));
    }
  }, [initialDomaines]);

  useEffect(() => {
    if (!selectedDomaine) {
      setPathologies([]);
      setSelectedPathologie(null);
      return;
    }
    setLoadingPathos(true);
    setError(null);
    fetch((process.env.NEXT_PUBLIC_API_BASE || "") + `/api/pathologies/?domaine_id=${selectedDomaine}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load pathologies");
        return r.json();
      })
      .then((data) => setPathologies(data))
      .catch((err) => setError(err.message || "Erreur lors du chargement"))
      .finally(() => setLoadingPathos(false));
  }, [selectedDomaine]);

  const onSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!q) return;
    setError(null);
    try {
      const r = await fetch((process.env.NEXT_PUBLIC_API_BASE || "") + `/api/search/?q=${encodeURIComponent(q)}`);
      if (!r.ok) throw new Error("Recherche échouée");
      const results = await r.json();
      // If exact pathologie found, navigate; otherwise pick first pathologie
      if (results && results.length > 0) {
        const first = results[0];
        router.push(`/fiche/${first.id}`);
      } else {
        setError("Aucun résultat trouvé");
      }
    } catch (err: any) {
      setError(err?.message || "Erreur réseau");
    }
  };

  const voirFiche = () => {
    const id = selectedPathologie;
    if (!id) return setError("Sélectionnez une pathologie");
    router.push(`/fiche/${id}`);
  };

  return (
    <div className="w-full max-w-3xl bg-white/80 p-6 rounded-xl shadow-md">
      <form onSubmit={onSearch} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Domaine</label>
            <select
              value={selectedDomaine ?? ""}
              onChange={(e) => setSelectedDomaine(e.target.value ? Number(e.target.value) : null)}
              className="w-full rounded-lg border px-3 py-2 shadow-sm"
            >
              <option value="">Sélectionner un domaine</option>
              {loadingDomaines ? (
                <option>Chargement...</option>
              ) : (
                domaines.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Pathologie</label>
            <select
              value={selectedPathologie ?? ""}
              onChange={(e) => setSelectedPathologie(e.target.value ? Number(e.target.value) : null)}
              className="w-full rounded-lg border px-3 py-2 shadow-sm"
              disabled={loadingPathos || pathologies.length === 0}
            >
              <option value="">Sélectionner une pathologie</option>
              {loadingPathos ? (
                <option>Chargement...</option>
              ) : (
                pathologies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Recherche</label>
            <div className="flex gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher domaine ou pathologie"
                className="w-full rounded-lg border px-3 py-2 shadow-sm"
                aria-label="recherche"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 rounded-lg">
                Chercher
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={voirFiche} className="px-4 py-2 bg-green-600 text-white rounded-lg">
            Voir fiche
          </button>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}
      </form>
    </div>
  );
}
