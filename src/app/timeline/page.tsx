"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ACCENT = "#D4AF37";

const CORRECT: Record<number, string[]> = {
  1: ["vayne", "Vayne"],
  2: ["naufragio", "naufrágio", "Naufrágio"], 
  3: ["product owner", "Product Owner"], 
  4: ["Filipenses 4:13", "filipenses 4:13", "Filipenses4:13", "filipenses 4:13"],
};

const routeFor = (id: number) => {
  const map: Record<number, string> = {
    1: "/ascensao",
    2: "/naufragio",
    3: "/incertezas",
    4: "/luta",
  };
  return map[id] ?? "/";
};

const cookieNameFor = (id: number) => `memory_gate_${id}`;

function norm(s: string) {
return s
.normalize("NFD")
.replace(/\p{Diacritic}+/gu, "")
.toLowerCase()
.trim();
}


// checa se valor bate com alguma alternativa correta
function isCorrectAnswer(stepId: number, value: string) {
const list = CORRECT[stepId] || [];
const v = norm(value);
return list.some((x) => norm(x) === v);
}

type Step = {
  id: number;
  title: string;
  text: string;
  question: string;
  placeholder?: string;
  hint?: string;
};

const STEPS: Step[] = [
  { id: 1, title: "Ascensão", text: "Vamos caçar aqueles que caíram na escuridão.", question: "De quem é essa frase?", placeholder: "Digite o personagem...", hint: "A que mais joga e tem arco" },
  { id: 2, title: "Em Profundezas", text: "Em águas profundas, afundando sem nenhuma luz…", question: "Qual projeto mais importante de calçados que fez?", placeholder: "Digite o projeto...", hint: "Tem haver com mar se nao é o mais importante um dos mais do senai" },
  { id: 3, title: "Incertezas", text: "Incertezas, decições, futuro", question: "Qual a profissão que esta decidia a fazer?", placeholder: "Ex.: desing, escrita, ti...", hint: "Falada recentemente em ingles e completo" },
  { id: 4, title: "Em luta", text: "tudo possa naquele que me fortalece", question: "Qual versicula da biblia se encontra essa frase?", placeholder: "Ex.: salmos46:1", hint: "versiculoxx:x" },
];


type Answers = Record<number, string>;

export default function TimelinePage() {
  const router = useRouter();
  const [active, setActive] = useState<Step | null>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answers>({});

  useEffect(() => {
  try {
  const raw = localStorage.getItem("timelineAnswers");
  if (raw) setAnswers(JSON.parse(raw));
  } catch {}
  }, []);


  // salvar respostas
  useEffect(() => {
  try {
  localStorage.setItem("timelineAnswers", JSON.stringify(answers));
  } catch {}
  }, [answers]);


  // nav teclado
  useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
  if (active) return; // não mexe se o modal estiver aberto
  const ids = STEPS.map((s) => s.id);
  const idx = current ? ids.indexOf(current) : -1;


  if (e.key === "ArrowRight") {
  const next = ids[Math.min(idx + 1, ids.length - 1)];
  setCurrent(next ?? ids[0]);
  }
  if (e.key === "ArrowLeft") {
  const prev = ids[Math.max(idx - 1, 0)];
  setCurrent(prev ?? ids[0]);
  }
  if (e.key === "Enter" && current != null) {
  const s = STEPS.find((x) => x.id === current)!;
  setActive(s);
  }
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
  }, [active, current]);


  // progresso preenchido
  const progressPct = useMemo(() => {
  if (!current) return 0;
  const idx = STEPS.findIndex((s) => s.id === current);
  return ((idx + 1) / STEPS.length) * 100;
  }, [current]);


  // um ponto é “feito” se tiver resposta salva
  const isDone = (id: number) => !!answers[id] && answers[id].trim().length > 0;


  // valida + redireciona (somente se correto) — retorna string de erro ou null
  const validateAndGo = (step: Step, value: string): string | null => {
    if (!value || !value.trim()) return "Digite algo antes de enviar.";
    if (!isCorrectAnswer(step.id, value)) {
      // adiciona a dica no texto do erro
      return step.hint ? `Resposta incorreta. Tente novamente. Dica: ${step.hint}` : "Resposta incorreta. Tente novamente.";
    }

    setAnswers((a) => ({ ...a, [step.id]: value }));
    try {
      document.cookie = `${cookieNameFor(step.id)}=1; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    } catch {}
    router.push(routeFor(step.id));
    return null;
  };


  return (
    <main className="relative min-h-[100svh] overflow-hidden text-zinc-200 bg-black">

     <div className="absolute inset-0 z-0">
        <Image
        src="/images/timeline.png"     // arquivo em /public/images/timeline.png
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"  // cobre 100% da tela
        />
        {/* véu escuro por cima da imagem */}
        <div className="absolute inset-0 bg-black/70" />
        {/* brilho sutil */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_60%)]" />
    </div>

      {/* Header */}
      <header className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-8 pb-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          <span style={{ color: ACCENT }}>•</span>{" "} Linha do Tempo <span style={{ color: ACCENT }}>•</span>{" "}
        </h1>
      </header>


      {/* TIMELINE (centralizada vertical) */}
      <section className="mx-auto grid min-h-[calc(100dvh-160px)] w-full max-w-6xl place-items-center px-6">
        <div className="relative w-full max-w-5xl">
          {/* Card de vidro */}
          <div className="absolute inset-0 -z-10 rounded-3xl border border-zinc-800/60 bg-zinc-950/40 backdrop-blur-md" />

          {/* Trilho */}
          <div className="relative mx-6 mt-12 h-2 rounded-full bg-zinc-800/70 shadow-inner overflow-hidden">
            {/* preenchimento de progresso */}
            <motion.div
              className="absolute left-0 top-0 h-full"
              style={{ background: `linear-gradient(90deg, ${ACCENT}aa, ${ACCENT}55)` }}
              animate={{ width: `${progressPct}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
            />
            {/* brilho correndo */}
            <span
              className="pointer-events-none absolute inset-0 rounded-full opacity-40"
              style={{
                background: `linear-gradient(90deg, transparent, ${ACCENT}22, transparent)`,
                maskImage: "linear-gradient(90deg, transparent 0%, black 20%, black 80%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 20%, black 80%, transparent 100%)",
                animation: "sheen 2.8s linear infinite",
              }}
            />
          </div>

          {/* Pontos */}
          <div
            className="relative -mt-6 grid gap-0 px-6"
            style={{ gridTemplateColumns: `repeat(${STEPS.length}, minmax(0, 1fr))` }}
          >
            {STEPS.map((s) => (
              <TimelineDot
                key={s.id}
                step={s}
                state={isDone(s.id) ? "done" : current === s.id ? "current" : "idle"}
                onOpen={() => {
                  setActive(s);
                  setCurrent(s.id);
                }}
                setCurrent={() => setCurrent(s.id)}
              />
            ))}
          </div>

          {/* Legendas */}
          <div
            className="mt-8 grid gap-2 px-6"
            style={{ gridTemplateColumns: `repeat(${STEPS.length}, minmax(0, 1fr))` }}
          >
            {STEPS.map((s) => (
              <div key={s.id} className="text-center text-xs text-zinc-400">
                {s.title}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dialog */}
      <AnimatePresence>
        {active && (
          <RetroDialog
            step={active}
            defaultValue={answers[active.id] ?? ""}
            onClose={() => setActive(null)}
            validate={(value) => validateAndGo(active, value)} // ⬅ usa validação
          />
        )}
      </AnimatePresence>


      <footer className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-xs text-zinc-400">
        {new Date().getFullYear()} • Caixa de Memórias
      </footer>

      <style jsx global>{`
        @keyframes sheen {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </main>
  );
}

function TimelineDot({
  step,
  onOpen,
  setCurrent,
  state, // "idle" | "current" | "done"
}: {
  step: Step;
  onOpen: () => void;
  setCurrent: () => void;
  state: "idle" | "current" | "done";
}) {
  const glow =
    state === "done"
      ? `0 0 26px ${ACCENT}77, inset 0 0 12px ${ACCENT}33`
      : state === "current"
      ? `0 0 32px ${ACCENT}aa, inset 0 0 16px ${ACCENT}55`
      : `0 0 16px rgba(0,0,0,0.35)`;

  return (
    <div className="flex items-center justify-center">
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        onMouseEnter={setCurrent}
        onFocus={setCurrent}
        onClick={onOpen}
        className="group relative grid place-items-center rounded-full p-3 outline-none focus:ring-2"
        aria-label={`Abrir passo ${step.id}`}
        style={{
          boxShadow: glow,
          border: `1px solid ${state !== "idle" ? `${ACCENT}AA` : "#3f3f46"}`,
          background:
            "radial-gradient(100% 100% at 50% 50%, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.6) 100%)",
        }}
      >
        {/* halo pulsante no atual */}
        {state === "current" && (
          <motion.span
            className="absolute inset-[-10px] rounded-full"
            animate={{ boxShadow: `0 0 36px ${ACCENT}88` }}
            transition={{ repeat: Infinity, duration: 1.2, repeatType: "reverse" }}
          />
        )}

        {/* ícone / número */}
        <span
          className="z-10 select-none text-lg font-extrabold tracking-tight"
          style={{ color: ACCENT }}
        >
          {state === "done" ? "✔" : step.id}
        </span>

        {/* disco */}
        <span className="absolute inset-0 rounded-full bg-black/50 backdrop-blur-sm" />

        {/* tooltip */}
        <motion.div
          initial={{ y: 6, opacity: 0 }}
          whileHover={{ y: -8, opacity: 1 }}
          className="pointer-events-none absolute -top-12 grid max-w-[180px] place-items-center rounded-md border border-zinc-700 bg-zinc-900/95 px-2.5 py-1.5 text-[11px] text-zinc-200 shadow-xl"
        >
          <div className="font-semibold" style={{ color: ACCENT }}>
            {step.title}
          </div>
          {step.hint && <div className="text-[10px] text-zinc-400">{step.hint}</div>}
        </motion.div>
      </motion.button>
    </div>
  );
}

function RetroDialog({
  step,
  defaultValue,
  onClose,
  validate,
}: {
  step: Step;
  defaultValue?: string;
  onClose: () => void;
  validate: (value: string) => string | null; // retorna erro ou null (ok)
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step.id]);

  const trySubmit = () => {
    const err = validate(value);
    if (err) {
      setError(err);
      setShake(true);
      setTimeout(() => setShake(false), 450);
      return;
    }
    setError(null);
    onClose(); // fecha ao redirecionar (o push já acontece na validateAndGo)
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        key={step.id}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className={`relative w-[min(92vw,680px)] rounded-2xl border border-zinc-700/70 bg-zinc-950/90 p-6 shadow-2xl backdrop-blur ${shake ? "[animation:shake_0.45s]" : ""}`}
      >
        {/* faixa decorativa */}
        <div
          className="absolute inset-x-6 -top-2 h-[3px] rounded-full"
          style={{ background: `linear-gradient(90deg, ${ACCENT}, transparent)` }}
        />
        <h3 className="mb-1 text-lg font-semibold" style={{ color: ACCENT }}>
          {step.title}
        </h3>
        <p className="mb-4 text-sm text-zinc-300">{step.text}</p>

        <label className="mb-2 block text-sm font-medium text-zinc-200">
          {step.question}
        </label>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={step.placeholder}
          className={`w-full rounded-md border px-3 py-2 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 ${
            error
              ? "border-red-600/70 bg-zinc-900 focus:ring-red-400/60"
              : "border-zinc-700 bg-zinc-900 focus:ring-amber-400/60"
          }`}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              trySubmit();
            }
          }}
        />
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
          >
            Fechar
          </button>
          <button
            onClick={trySubmit}
            className="rounded-md border border-amber-500/40 bg-amber-600/20 px-3 py-2 text-sm text-amber-200 hover:bg-amber-500/30"
          >
            Enviar
          </button>
        </div>

        <Corner decoColor={ACCENT} pos="tl" />
        <Corner decoColor={ACCENT} pos="tr" />
        <Corner decoColor={ACCENT} pos="bl" />
        <Corner decoColor={ACCENT} pos="br" />
      </motion.div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) }
          20% { transform: translateX(-6px) }
          40% { transform: translateX(6px) }
          60% { transform: translateX(-4px) }
          80% { transform: translateX(4px) }
        }
      `}</style>
    </motion.div>
  );
}


/* cantos decorativos do dialog */
function Corner({ decoColor, pos }: { decoColor: string; pos: "tl" | "tr" | "bl" | "br" }) {
  const base = "pointer-events-none absolute h-6 w-6 opacity-70";
  const map: Record<typeof pos, string> = {
    tl: "left-2 top-2 rounded-tl-xl border-t border-l",
    tr: "right-2 top-2 rounded-tr-xl border-t border-r",
    bl: "left-2 bottom-2 rounded-bl-xl border-b border-l",
    br: "right-2 bottom-2 rounded-br-xl border-b border-r",
  } as const;
  return <div className={`${base} ${map[pos]}`} style={{ borderColor: `${decoColor}66` }} />;
}
