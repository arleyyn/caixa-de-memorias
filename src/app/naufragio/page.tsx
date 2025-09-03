"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
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
    title: "Em Profundezas",
    subtitle: "Capítulo 2",
    description:
      "Uma jovem sonhadora, fascinada pela imensidão do mar, recebeu a oportunidade de embarcar como tripulante em um navio pirata. Cercada de pessoas desconhecidas e algumas figuras estranhas, preferiu, a princípio, manter-se reservada, com medo e receio de se abrir demais.",
    image: "/naufragio/slide1.png",
    accent: "#D4AF37",
  },
  {
    id: 2,
    title: "",
    subtitle: "",
    description:
      "Com o tempo, no entanto, começou a criar laços. Tornou-se próxima de uma mulher sábia, que lhe ensinou a arte de modelar objetos com matérias-primas simples. A jovem descobriu prazer nesse ofício, dedicando-se cada vez mais à criação. Seu gosto eram os calçados: cada modelo que produzia refletia inovação e criatividade. Logo percebeu que tinha talento e dessa forma decidiu que, ao chegar em terra firme, iria levar aquele gosto de fazer calçados para a vida.",
    image: "/naufragio/slide2.png",
    accent: "#D4AF37",
  },
  {
    id: 3,
    title: "",
    subtitle: "",
    description:
      "Mas o mar, antes calmo e tranquilo, começou a mudar. As ondas se tornaram mais violentas, os ventos mais fortes, até que uma tempestade colossal tomou conta do navio. A embarcação virou, e o desespero tomou conta. A jovem lutou com todas as forças para resistir, mas o oceano a arrastava para o profundo e escuro mar. Entre a escuridão e a falta de ar, sua esperança começou a se ir.",
    image: "/naufragio/slide3.png",
    accent: "#D4AF37",
  },
  {
    id: 4,
    title: "",
    subtitle: "",
    description:
      "Foi nesse momento de quase desistência que tudo mudou. Uma luz intensa rompeu as águas, envolvendo-a.",
    image: "/naufragio/slide4.png",
    accent: "#D4AF37",
  },
  {
    id: 5,
    title: "",
    subtitle: "",
    description:
      "Já inconsciente, ela não percebeu como, mas quando abriu os olhos estava em terra firme, em uma cidade desconhecida. Então, entendeu que o naufrágio não havia sido o fim, mas o início de uma nova jornada. Reergueu-se, pegou suas ferramentas e decidiu que aquele seria apenas o primeiro capítulo da grande batalha de sua vida.",
    image: "/naufragio/slide5.png",
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

  // Memoriza goTo para satisfazer exhaustive-deps
  const goTo = useCallback(
    (next: number) => {
      setIndex((prev) => {
        const dir: 1 | -1 = next > prev ? 1 : -1;
        setDirection(dir);
        return (next + length) % length;
      });
    },
    [length]
  );

  useEffect(() => {
    if (!AUTOPLAY) return;
    const t = setInterval(() => {
      goTo(index + 1);
    }, INTERVAL);
    return () => clearInterval(t);
  }, [index, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, goTo]);

  // Tipagem correta para evitar "any"
  const onDragEnd = (
    _evt: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const dx = info?.offset?.x ?? 0;
    if (dx < -80) goTo(index + 1);
    else if (dx > 80) goTo(index - 1);
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
                  href="/timeline"
                  className="mt-6 inline-block rounded-md border border-amber-500/40 bg-black/40 px-4 py-2 text-sm font-medium text-amber-300 backdrop-blur transition hover:bg-black/60"
                >
                  ← Voltar para a timeline
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
          const dir: 1 | -1 = i > index ? 1 : -1;
          setDirection(dir);
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
