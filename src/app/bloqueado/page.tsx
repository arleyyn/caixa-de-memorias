export default function BlockedPage({ searchParams }: { searchParams: { step?: string } }) {
  const s = searchParams?.step ? ` #${searchParams.step}` : "";
  return (
    <main className="grid min-h-dvh place-items-center bg-black text-zinc-200">
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 p-6 shadow-xl">
        <h1 className="text-xl font-semibold mb-2">Acesso bloqueado</h1>
        <p className="text-sm text-zinc-400">
          Você precisa acertar a resposta da etapa{s} para ver esta memória.
        </p>
        <a href="/timeline" className="mt-4 inline-block rounded-md border border-amber-500/40 bg-amber-600/20 px-4 py-2 text-amber-200 hover:bg-amber-500/30">
          Voltar para a linha do tempo
        </a>
      </div>
    </main>
  );
}
