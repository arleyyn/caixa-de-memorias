"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT = "#D4AF37";

export default function ParabensPage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="relative min-h-dvh flex items-center justify-center overflow-hidden text-zinc-200">
      {/* fundo */}
      <div className="absolute inset-0 -z-10">
        <div
          className="h-full w-full bg-contain bg-center"
          style={{ backgroundImage: "url(/images/aniversario.png)" }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_60%)]" />
      </div>

      {/* botão central */}
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl border border-amber-500/40 bg-amber-600/20 px-6 py-3 text-lg font-semibold text-amber-300 shadow-lg hover:bg-amber-600/30 hover:shadow-amber-500/20 transition"
      >
        ✦ Abrir a mensagem ✦
      </button>

      {/* dialog */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* overlay */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* conteúdo do dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-3xl rounded-2xl border border-amber-500/30 bg-black/80 p-8 shadow-2xl backdrop-blur-lg"
            >
              {/* faixa superior */}
              <div
                className="absolute inset-x-8 -top-2 h-[3px] rounded-full"
                style={{ background: `linear-gradient(90deg, ${ACCENT} 0%, transparent 100%)` }}
              />

              <h1 className="mb-4 text-3xl font-bold text-amber-400 text-center">
                ✦ Parabéns, Estherzinha ✦
              </h1>

              <div className="space-y-4 text-lg leading-relaxed text-zinc-200">
                <p>
                  Esta Caixa de Memórias foi feita para relembrar alguns momentos
                  especiais que tive o privilégio de presenciar ao seu lado.
                </p>
                <p>
                  Minha ideia inicial era criar um jogo de plataforma, no estilo de{" "}
                  <em>Hollow Knight</em>, mas como não consegui finalizar a tempo,
                  deixo este presente como símbolo do passado, do presente e do futuro
                  que você tem pela frente.
                </p>
                <p>
                  Você é uma mulher incrível. Desejo que este novo ciclo seja marcado
                  pela superação dos desafios e pela conquista dos seus sonhos. Sei
                  que os problemas de saúde não vão te derrubar — pelo contrário, vão
                  se tornar testemunhos de vitória.
                </p>
                <p>
                  Mesmo que às vezes se sinta confusa profissionalmente, confie: você
                  é capaz de focar em algo e se tornar excelente, a ponto de alcançar
                  grandes empresas e deixar sua marca.
                </p>
                <p>
                  A vida pode estar agitada, mas lembre-se: construa sua jornada passo
                  a passo, com calma e consistência. Não tente abraçar o mundo de uma
                  vez — escolha um caminho promissor e siga firme nele.
                </p>
                <p>
                  Eu te desejo muito sucesso, felicidade e, acima de tudo, quero ver
                  você bem e sorrindo como já vi em tantos momentos. No que precisar,
                  pode sempre contar comigo.
                </p>
              </div>

              <p className="mt-6 text-right font-semibold text-amber-400">— Arley</p>

              {/* botão fechar */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-zinc-600 bg-zinc-800/70 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
