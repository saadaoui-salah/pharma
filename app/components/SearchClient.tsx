"use client";

import { useState, useEffect } from "react";
import Fuse from "fuse.js";

type Pathologie = { id: number; name: string; domaine?: string };

export default function SearchClient() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Pathologie[]>([]);
  const [results, setResults] = useState<Pathologie[]>([]);

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_BASE || "/api/v1") + "/pathologies/")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Pathologie[] | any) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (!q) return setResults([]);
  const fuse = new Fuse<Pathologie>(items, { keys: ["name", "domaine"] as const });
  type F = Fuse.FuseResult<Pathologie>;
  setResults(fuse.search(q).map((r: F) => r.item));
  }, [q, items]);

  return (
    <div className="w-full max-w-xl">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="border rounded px-3 py-2 w-full"
        placeholder="Search pathologies or domaines"
        aria-label="search"
      />
      <ul className="mt-2">
        {(q ? results : items.slice(0, 10)).map((it) => (
          <li key={it.id} className="py-2 border-b">
            <a href={`/pathology/${it.id}`}>{it.name}</a>
            <div className="text-xs text-muted">{it.domaine}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
