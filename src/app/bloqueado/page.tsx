// app/bloqueado/page.tsx
import Link from "next/link";

export default async function BlockedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  // pega o valor de `step` (string ou array)
  const raw =
    typeof sp.step === "string"
      ? sp.step
      : Array.isArray(sp.step)
      ? sp.step[0]
      : "";

  // aceita número ou slug
  const slugFromId: Record<string, string> = {
    "1": "ascensao",
    "2": "naufragio",
    "3": "incertezas",
    "4": "luta",
  };
  const displayFromSlug: Record<string, string> = {
    ascensao: "Ascensão",
    naufragio: "Naufrágio",
    incertezas: "Incertezas",
    luta: "Luta",
  };

  const slug = slugFromId[raw] ?? raw; // se veio "1", vira "ascensao"; se já veio slug, mantém
  const etapaLabel = displayFromSlug[slug] ?? "";

  return (
    <main className="grid min-h-dvh place-items-center bg-black text-zinc-200">
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 p-6 shadow-xl">
        <h1 className="mb-2 text-xl font-semibold">Acesso bloqueado</h1>
        <p className="text-sm text-zinc-400">
          Você precisa acertar a resposta da etapa
          {etapaLabel ? ` — ${etapaLabel}` : ""} para ver esta memória.
        </p>

        <Link
          href="/timeline"
          className="mt-4 inline-block rounded-md border border-amber-500/40 bg-amber-600/20 px-4 py-2 text-amber-200 hover:bg-amber-500/30"
        >
          Voltar para a linha do tempo
        </Link>
      </div>
    </main>
  );
}
