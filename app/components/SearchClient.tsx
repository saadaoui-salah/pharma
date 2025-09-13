"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Fuse from "fuse.js";

export default function SearchClient() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get((process.env.NEXT_PUBLIC_API_BASE || "/api/v1") + "/pathologies/")
      .then((r) => setItems(r.data))
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (!q) return setResults([]);
    const fuse = new Fuse(items, { keys: ["name", "domaine"] });
    setResults(fuse.search(q).map((r) => r.item));
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
