"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type Slide = {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  image: string; 
  accent?: string;
};

const SLIDES: Slide[] = [
  {
    id: 1,
    title: "Em luta",
    subtitle: "Capítulo 4",
    description: "Em uma pequena cidade, vivia uma pequena jovem com uma vida simples e comum. Suas preocupações eram como as de qualquer pessoa: escola, hobbies e o futuro que ainda precisava decidir. Mas, de repente, algo mudou. Ela começou a sentir dores constantes: barriga, cabeça, mal-estar. Por mais que cuidasse da alimentação e fizesse tudo certo, o incômodo não a deixava.",
    image: "/luta/slide1.png",
    accent: "#D4AF37",
  },
  {
    id: 2,
    title: "",
    subtitle: "",
    description: "Mesmo trabalhando sob alta pressão em fábricas, suportava tudo sozinha. Guardava para si a dor, sem querer preocupar ninguém, sem transformar seu sofrimento em problema para os outros.",
    image: "/luta/slide2.png",
    accent: "#D4AF37",
  },
  {
    id: 3,
    title: "",
    subtitle: "",
    description: "Até que, um dia, a situação se agravou. O que antes era suportável se tornou insuportável. Dores intensas, corpo fraco, pele pálida. Ainda assim, ela insistia em manter a rotina, acreditando que iria passar. Mas chegou um ponto em que não havia mais como resistir: precisou buscar ajuda. Depois de muitos processos e diagnósticos, descobriu a origem do problema. A partir dali, sua vida teria de mudar novos hábitos, novas rotinas, e o maior desafio: conviver diariamente com a dor.",
    image: "/luta/slide3.png",
    accent: "#D4AF37",
  },
  {
    id: 4,
    title: "",
    subtitle: "",
    description: "Mesmo assim, permaneceu firme. Encontrou forças além de si mesma, reconhecendo que ninguém supera sozinho todos os obstáculos. Sabia que precisaria de apoio e de fé para enfrentar aquela batalha. Alguns sonhos e projetos tiveram de ser adiados, mas nunca esquecidos.",
    image: "/luta/slide4.png",
    accent: "#D4AF37",
  },
  {
    id: 5,
    title: "",
    subtitle: "",
    description: "Com o tempo, as dores se tornaram mais suportáveis. A rotina, antes pesada, ganhou novos respiros. Atividades físicas, que pareciam bem difíceis, voltaram aos poucos. Parecia que a melhora viria. Mas, de repente, tudo mudou de novo: o corpo voltou a falhar, a fraqueza se intensificou, e novos problemas surgiram.",
    image: "/luta/slide5.png",
    accent: "#D4AF37",
  },
  {
    id: 6,
    title: "",
    subtitle: "",
    description: "Ainda assim, ela buscou tratamento. Aprendeu que a vida sempre trará dificuldades, mas que o essencial é seguir em frente. Descobriu que a força dos braços não é suficiente para vencer dores invisíveis. Somente Deus pode curar, sustentar e renovar as forças.",
    image: "/luta/slide6.png",
    accent: "#D4AF37",
  },
    {
    id: 7,
    title: "",
    subtitle: "",
    description: "Mesmo com a rotina alterada, mesmo em meio às dificuldades, ela escolheu acreditar. Sabia que os períodos de dor passariam. Que a cura é possível. E que cuidar da saúde sempre vem antes de qualquer sonho porque sem saúde, não há como alcançar nenhum deles.",
    image: "/luta/slide7.png",
    accent: "#D4AF37",
  },
];

const AUTOPLAY = false;   
const INTERVAL = 6000;   
const PERSPECTIVE = 1200;  
const TRANSITION = 0.65;    

export default function FullscreenCarouselPage() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const length = SLIDES.length;

  useEffect(() => {
    if (!AUTOPLAY) return;
    const t = setInterval(() => {
      goTo(index + 1);
    }, INTERVAL);
    return () => clearInterval(t);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  const goTo = (next: number) => {
    const clamped = (next + length) % length;
    setDirection(next > index ? 1 : -1);
    setIndex(clamped);
  };

  const dragConfidence = 80; // px
  const onDragEnd = (_: any, info: { offset: { x: number } }) => {
    const dx = info?.offset?.x ?? 0;
    if (dx < -dragConfidence) goTo(index + 1);
    else if (dx > dragConfidence) goTo(index - 1);
  };

  const current = SLIDES[index];

  return (
    <main
      className="relative min-h-[100svh] overflow-hidden text-zinc-200 bg-black"
      style={{ perspective: `${PERSPECTIVE}px` }}
    >

      <AnimatePresence custom={direction} mode="popLayout">
        <motion.section
          key={current.id}
          className="absolute inset-0 grid"
          custom={direction}
          initial="enter"
          animate="center"
          exit="exit"
          variants={pageTurnVariants}
          transition={{ duration: TRANSITION, ease: [0.25, 0.8, 0.2, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={onDragEnd}
        >

          <div className="absolute inset-0 -z-10">
            <Image
              src={current.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />

            <div className="absolute inset-0 bg-black/60" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_60%)]" />
          </div>
            <div className="pointer-events-none absolute top-8 left-1/2 z-20 w-full max-w-3xl -translate-x-1/2 px-6 sm:top-10">
            <div className="pointer-events-auto text-center">
                {current.subtitle && (
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-zinc-300">
                    {current.subtitle}
                </p>
                )}
                <h1
                className="text-balance text-4xl font-bold sm:text-5xl"
                style={{ color: current.accent ?? "#D4AF37" }}
                >
                {current.title}
                </h1>
                {current.description && (
                <p className="mt-4 text-lg leading-relaxed text-zinc-200">
                    {current.description}
                </p>
                )}

                {/* Botão só no último slide */}
               {index === length - 1 && (
                  <Link
                    href="/aniversario"
                    className="mt-6 inline-block rounded-md border border-amber-500/40 bg-black/40 px-4 py-2 text-sm font-medium text-amber-300 backdrop-blur transition hover:bg-black/60"
                  >
                    Ir para o aniversário 🎂
                  </Link>
                )}

            </div>
            </div>
        </motion.section>
      </AnimatePresence>

      <Controls
        onPrev={() => goTo(index - 1)}
        onNext={() => goTo(index + 1)}
        accent={current.accent}
      />

      <Dots
        count={length}
        index={index}
        setIndex={(i) => {
          setDirection(i > index ? 1 : -1);
          setIndex(i);
        }}
        accent={current.accent}
      />
    </main>
  );
}

const pageTurnVariants = {
  enter: (dir: 1 | -1) => ({
    opacity: 0,
    rotateY: -10 * dir,
    x: dir > 0 ? 60 : -60,
    transformOrigin: dir > 0 ? "100% 50%" : "0% 50%",
    filter: "blur(2px)",
  }),
  center: {
    opacity: 1,
    rotateY: 0,
    x: 0,
    transformOrigin: "50% 50%",
    filter: "blur(0px)",
  },
  exit: (dir: 1 | -1) => ({
    opacity: 0,
    rotateY: 10 * dir,
    x: dir > 0 ? -60 : 60,
    transformOrigin: dir > 0 ? "0% 50%" : "100% 50%",
    filter: "blur(2px)",
  }),
};

function Controls({
  onPrev,
  onNext,
  accent = "#D4AF37",
}: {
  onPrev: () => void;
  onNext: () => void;
  accent?: string;
}) {
  const common =
    "group grid h-12 w-12 place-items-center rounded-full border backdrop-blur bg-black/30 hover:bg-black/40 transition";
  return (
    <>
      <button
        onClick={onPrev}
        className={`absolute left-4 top-1/2 -translate-y-1/2 ${common}`}
        style={{ borderColor: `${accent}66` }}
        aria-label="Anterior"
      >
        <ChevronLeft className="h-6 w-6" style={{ color: accent }} />
      </button>
      <button
        onClick={onNext}
        className={`absolute right-4 top-1/2 -translate-y-1/2 ${common}`}
        style={{ borderColor: `${accent}66` }}
        aria-label="Próximo"
      >
        <ChevronRight className="h-6 w-6" style={{ color: accent }} />
      </button>
    </>
  );
}

function Dots({
  count,
  index,
  setIndex,
  accent = "#D4AF37",
}: {
  count: number;
  index: number;
  setIndex: (i: number) => void;
  accent?: string;
}) {
  return (
    <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full border border-zinc-700/60 bg-black/40 px-3 py-1.5 backdrop-blur">
      <div className="flex items-center gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="h-2.5 w-2.5 rounded-full transition"
            aria-label={`Ir ao slide ${i + 1}`}
            style={{
              background: i === index ? accent : "rgba(255,255,255,0.35)",
              boxShadow: i === index ? `0 0 18px ${accent}66` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}
