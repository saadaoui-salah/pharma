import axios from "axios";

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  const id = params.id;
  let data = null;
  try {
    const res = await axios.get((process.env.NEXT_PUBLIC_API_BASE || "/api/v1") + `/fiches/${id}/`);
    data = res.data;
  } catch (e) {
    data = null;
  }
  if (!data) return <div className="p-6">Fiche not found</div>;
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">{data.pathologie.name}</h1>
      <p className="text-sm text-muted">Domaine: {data.pathologie.domaine}</p>
      <section className="mt-4">
        <h2 className="font-semibold">First intention</h2>
        <div>{data.first_intention}</div>
      </section>
      <section className="mt-4">
        <h2 className="font-semibold">Alternatives</h2>
        <div>{data.alternatives}</div>
      </section>
    </main>
  );
}
